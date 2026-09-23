/**
 * Redbook Math App - 영서중 수학 1학년 통합 LMS DB Integration SDK
 * Connects directly with Supabase Cloud DB Engine (PostgreSQL)
 * Features:
 *  - 100% Supabase Cloud DB Single Source of Truth (Zero reliance on expired mock APIs)
 *  - Unit-specific progress and unlock isolation (u1, u2, u4)
 *  - Cross-unit unified session sharing
 *  - Teacher master authentication (260523, 260831)
 */

(function(window) {
  'use strict';

  const SUPABASE_URL = 'https://agcmetuneycqzhvshmoe.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_r_0ZhunAe99ftol-JqL5qg_ADZ1BH_X';

  const LOCAL_CACHE_USER_KEY = 'redbook_current_user';
  const LOCAL_CACHE_USER_KEY_LEGACY = 'redbook_g1_current_user';
  const LOCAL_CACHE_PROGRESS_PREFIX = 'redbook_progress_';

  let supabaseClient = null;

  function getSupabase() {
    if (!supabaseClient && typeof window.supabase !== 'undefined') {
      try {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      } catch (err) {
        console.warn('⚠️ [LMSIntegration-G1] Supabase init warning:', err);
      }
    }
    return supabaseClient;
  }

  const LMSIntegration = {
    unitId: 'u1',
    currentUser: null,
    onStudentLoadedCallback: null,

    init(options) {
      options = options || {};
      if (options.unitId) {
        this.unitId = String(options.unitId).toLowerCase();
      }
      if (typeof options.onStudentLoaded === 'function') {
        this.onStudentLoadedCallback = options.onStudentLoaded;
      }

      const cached = this.getCurrentUserFromCache();
      if (cached) {
        this.currentUser = cached;
      }

      // Handle iframe postMessage handshake
      window.addEventListener('message', (event) => {
        if (!event.data || typeof event.data !== 'object') return;
        if (event.data.type === 'MATH_LMS_INIT_STUDENT' && event.data.student) {
          const st = event.data.student;
          this.setCurrentUser({
            id: String(st.id || '').trim(),
            name: String(st.name || '').trim(),
            grade: String(st.grade || '1').trim(),
            classNum: String(st.classNum || st.class_num || '1').trim(),
            role: st.role || 'student'
          });
          if (this.onStudentLoadedCallback) {
            this.onStudentLoadedCallback(this.currentUser);
          }
        }
      });

      if (window.parent && window.parent !== window) {
        try {
          window.parent.postMessage({ type: 'MATH_LMS_REQUEST_STUDENT_INFO' }, '*');
        } catch (e) {}
      }
    },

    setUnitId(unitId) {
      if (unitId) this.unitId = String(unitId).toLowerCase();
    },

    getCurrentUserFromCache() {
      try {
        const raw = localStorage.getItem(LOCAL_CACHE_USER_KEY) || localStorage.getItem(LOCAL_CACHE_USER_KEY_LEGACY);
        if (raw) return JSON.parse(raw);
      } catch (e) {}
      return null;
    },

    setCurrentUser(userObj) {
      this.currentUser = userObj;
      try {
        if (userObj) {
          const jsonStr = JSON.stringify(userObj);
          localStorage.setItem(LOCAL_CACHE_USER_KEY, jsonStr);
          localStorage.setItem(LOCAL_CACHE_USER_KEY_LEGACY, jsonStr);
        } else {
          localStorage.removeItem(LOCAL_CACHE_USER_KEY);
          localStorage.removeItem(LOCAL_CACHE_USER_KEY_LEGACY);
        }
      } catch (e) {}
    },

    logout() {
      this.setCurrentUser(null);
    },

    async loginStudent(studentId, password) {
      const cleanId = String(studentId || '').trim();
      const cleanPw = String(password || '').trim();

      if (!cleanId || !cleanPw) {
        return { success: false, message: '학번과 비밀번호를 모두 입력해 주세요.' };
      }

      // Teacher Master Passwords
      if (cleanPw === '260523' || cleanPw === '260831' || cleanPw === '661227' ||
          cleanId === '260523' || cleanId === '260831' || cleanId === '661227') {
        const masterUser = {
          id: '260523',
          name: '임종윤 선생님',
          grade: '1',
          classNum: '1',
          role: 'teacher'
        };
        this.setCurrentUser(masterUser);
        return { success: true, user: masterUser, message: '선생님 마스터 비밀번호로 인증되었습니다.' };
      }

      // Supabase Direct Query
      const sb = getSupabase();
      if (sb) {
        try {
          const { data, error } = await sb
            .from('students')
            .select('*')
            .eq('id', cleanId)
            .maybeSingle();

          if (!error && data) {
            if (String(data.password).trim() === cleanPw) {
              const userObj = {
                id: String(data.id).trim(),
                name: String(data.name || `학생 ${cleanId}`).trim(),
                grade: String(data.grade || '1'),
                classNum: String(data.class_num || cleanId.slice(2, 3) || '1'),
                role: 'student'
              };
              this.setCurrentUser(userObj);
              return { success: true, user: userObj, message: `환영합니다, ${userObj.name}님!` };
            } else {
              return { success: false, message: '비밀번호가 일치하지 않습니다.' };
            }
          }
        } catch (err) {
          console.warn('[LMSIntegration-G1] Supabase login error:', err);
        }
      }

      // Fallback cache check
      try {
        const cachedStudentsRaw = localStorage.getItem('mathlab_students_cache');
        if (cachedStudentsRaw) {
          const cachedStudents = JSON.parse(cachedStudentsRaw);
          const matched = cachedStudents.find(s => String(s.id).trim() === cleanId);
          if (matched && String(matched.password).trim() === cleanPw) {
            const userObj = {
              id: matched.id,
              name: matched.name,
              grade: String(matched.grade || '1'),
              classNum: String(matched.classNum || cleanId.slice(2, 3) || '1'),
              role: 'student'
            };
            this.setCurrentUser(userObj);
            return { success: true, user: userObj, message: `환영합니다, ${userObj.name}님!` };
          }
        }
      } catch (e) {}

      return { success: false, message: '영서중 수학 LMS DB에 등록되지 않은 학번이거나 비밀번호가 올바르지 않습니다.' };
    },

    /**
     * Load student's saved progress from Supabase DB, isolated by unitId (u1, u2, u4)
     */
    async loadStudentProgress(studentId, targetUnitId) {
      if (!studentId) return { lastSubStep: '0-1', completedSteps: [] };
      const cleanId = String(studentId).trim();
      const uId = String(targetUnitId || this.unitId || 'u1').toLowerCase();
      const localCacheKey = `${LOCAL_CACHE_PROGRESS_PREFIX}${uId}_${cleanId}`;

      // Query Supabase Activity Submissions
      const sb = getSupabase();
      if (sb) {
        try {
          const { data, error } = await sb
            .from('activity_submissions')
            .select('*')
            .eq('student_id', cleanId)
            .eq('grade', 1)
            .order('submitted_at', { ascending: false })
            .limit(40);

          if (!error && Array.isArray(data) && data.length > 0) {
            const completedSteps = [];
            let latestStep = null;

            data.forEach((sub) => {
              const title = String(sub.activity_title || '');
              
              // Unit Matching Check
              let isMatch = false;
              if (uId === 'u1') {
                isMatch = title.includes('소인수분해') || title.includes('[중1-1') || title.includes('u1');
              } else if (uId === 'u2') {
                isMatch = title.includes('정수와 유리수') || title.includes('[중1-2') || title.includes('u2');
              } else if (uId === 'u4') {
                isMatch = title.includes('좌표평면') || title.includes('[중1-4') || title.includes('u4') ||
                          (!title.includes('소인수분해') && !title.includes('정수와 유리수') && !title.includes('[중1-1') && !title.includes('[중1-2'));
              }

              if (isMatch) {
                const match = title.match(/단계:\s*([0-9]-[0-9]+)/);
                if (match && match[1]) {
                  const s = match[1];
                  if (!latestStep) latestStep = s;
                  if (!completedSteps.includes(s)) completedSteps.push(s);
                }
              }
            });

            if (latestStep) {
              const progressObj = {
                lastSubStep: latestStep,
                completedSteps: completedSteps,
                updatedAt: data[0].submitted_at || new Date().toISOString()
              };
              this.saveProgressToLocal(localCacheKey, progressObj);
              console.log(`🌐 [Supabase DB] Loaded isolated progress for ${cleanId} (${uId}):`, progressObj);
              return progressObj;
            }
          }
        } catch (sbErr) {
          console.warn('[Supabase DB] Error loading student progress:', sbErr);
        }
      }

      // Fallback to local storage for this specific unit
      const localProg = this.getProgressFromLocal(localCacheKey);
      if (localProg && localProg.lastSubStep) {
        return localProg;
      }

      return { lastSubStep: '0-1', completedSteps: [], updatedAt: '' };
    },

    /**
     * Save student progress to Supabase DB, isolated by unitId (u1, u2, u4)
     */
    async saveStudentProgress(subStepCode, data = {}, targetUnitId) {
      const uId = String(targetUnitId || this.unitId || 'u1').toLowerCase();
      let cleanId = '10101';
      let studentName = '학생';
      let classNum = 1;

      const activeUser = this.currentUser || this.getCurrentUserFromCache();
      if (activeUser && activeUser.id) {
        cleanId = String(activeUser.id).trim();
        studentName = activeUser.name || `학생 ${cleanId}`;
        classNum = parseInt(activeUser.classNum || cleanId.slice(2, 3)) || 1;
      }

      const localCacheKey = `${LOCAL_CACHE_PROGRESS_PREFIX}${uId}_${cleanId}`;
      const existing = this.getProgressFromLocal(localCacheKey) || { completedSteps: [] };
      const completedSet = new Set(existing.completedSteps || []);
      if (subStepCode) completedSet.add(subStepCode);
      const updatedCompleted = Array.from(completedSet);

      const progressObj = {
        lastSubStep: subStepCode || '0-1',
        completedSteps: updatedCompleted,
        updatedAt: new Date().toISOString()
      };

      // 1. Save to local cache
      this.saveProgressToLocal(localCacheKey, progressObj);

      // 2. Unit Title Formatting
      let unitPrefix = '[중1-1 소인수분해]';
      if (uId === 'u2') unitPrefix = '[중1-2 정수와 유리수]';
      else if (uId === 'u4') unitPrefix = '[중1-4 좌표평면]';

      const activityTitle = data.activityTitle || `${unitPrefix} [단계: ${subStepCode || '0-1'}]`;
      const answerText = data.answerText || '';
      const score = typeof data.score === 'number' ? data.score : 0;

      const payload = {
        student_id: cleanId,
        student_name: studentName,
        grade: 1,
        class_num: classNum,
        activity_title: activityTitle,
        answer_text: answerText,
        score: score,
        submitted_at: new Date().toISOString()
      };

      // 3. Save to Supabase
      const sb = getSupabase();
      if (sb) {
        try {
          await sb.from('activity_submissions').insert(payload);
          console.log(`🏛️ [Supabase DB] Saved activity for ${cleanId} (${uId}):`, subStepCode);
        } catch (e) {
          console.warn('[Supabase DB] Save activity error:', e);
        }
      }

      if (window.parent && window.parent !== window) {
        try {
          window.parent.postMessage({
            type: 'MATH_LMS_SUBMIT',
            activityTitle: payload.activity_title,
            answerText: payload.answer_text,
            score: payload.score,
            submittedAt: payload.submitted_at
          }, '*');
        } catch (e) {}
      }
    },

    getProgressFromLocal(cacheKey) {
      try {
        const raw = localStorage.getItem(cacheKey);
        if (raw) return JSON.parse(raw);
      } catch (e) {}
      return null;
    },

    saveProgressToLocal(cacheKey, progressObj) {
      try {
        localStorage.setItem(cacheKey, JSON.stringify(progressObj));
      } catch (e) {}
    },

    /**
     * Teacher Global Unlock: Saves unit-specific unlock boundary to Supabase DB
     */
    async saveGlobalUnlockStep(stepCode, targetUnitId) {
      const uId = String(targetUnitId || this.unitId || 'u1').toLowerCase();
      const cleanStep = String(stepCode || '0-1').trim();
      const sysKey = `SYS_UNLOCK_G1_${uId.toUpperCase()}`;

      try {
        localStorage.setItem(`redbook_g1_${uId}_global_unlock_step`, cleanStep);
      } catch (e) {}

      const sb = getSupabase();
      if (sb) {
        try {
          // Save primary isolated key
          await sb.from('activity_submissions').insert({
            student_id: sysKey,
            student_name: '교사 관리자',
            grade: 1,
            class_num: 0,
            activity_title: sysKey,
            answer_text: cleanStep,
            score: 100,
            submitted_at: new Date().toISOString()
          });

          // If u4, also update SYS_UNLOCK_G1 for backwards compatibility
          if (uId === 'u4') {
            await sb.from('activity_submissions').insert({
              student_id: 'SYS_UNLOCK_G1',
              student_name: '교사 관리자',
              grade: 1,
              class_num: 0,
              activity_title: 'SYS_UNLOCK_G1',
              answer_text: cleanStep,
              score: 100,
              submitted_at: new Date().toISOString()
            });
          }

          console.log(`🏛️ [Supabase DB] Saved unlock boundary for ${uId} (${sysKey}):`, cleanStep);
        } catch (e) {
          console.warn('[Supabase DB] Save unlock step error:', e);
        }
      }
    },

    /**
     * Teacher Global Unlock: Loads unit-specific unlock boundary from Supabase DB
     */
    async loadGlobalUnlockStep(targetUnitId) {
      const uId = String(targetUnitId || this.unitId || 'u1').toLowerCase();
      const sysKey = `SYS_UNLOCK_G1_${uId.toUpperCase()}`;

      let localSaved = '0-1';
      try {
        localSaved = localStorage.getItem(`redbook_g1_${uId}_global_unlock_step`) || '0-1';
      } catch (e) {}

      const sb = getSupabase();
      if (sb) {
        try {
          const { data, error } = await sb
            .from('activity_submissions')
            .select('*')
            .eq('student_id', sysKey)
            .order('id', { ascending: false })
            .limit(1);

          if (!error && Array.isArray(data) && data.length > 0 && data[0].answer_text) {
            const dbStep = String(data[0].answer_text).trim();
            if (dbStep) {
              try { localStorage.setItem(`redbook_g1_${uId}_global_unlock_step`, dbStep); } catch (e) {}
              return dbStep;
            }
          }

          // Fallback for coordinate unit u4 to SYS_UNLOCK_G1
          if (uId === 'u4') {
            const { data: legacyData, error: legacyErr } = await sb
              .from('activity_submissions')
              .select('*')
              .eq('student_id', 'SYS_UNLOCK_G1')
              .order('id', { ascending: false })
              .limit(1);

            if (!legacyErr && Array.isArray(legacyData) && legacyData.length > 0 && legacyData[0].answer_text) {
              const legacyStep = String(legacyData[0].answer_text).trim();
              if (legacyStep) return legacyStep;
            }
          }
        } catch (e) {
          console.warn('[Supabase DB] Load unlock step error:', e);
        }
      }

      return localSaved;
    },

    lastKnownUnlockStep: null,
    unlockSyncIntervalId: null,

    startUnlockBoundarySync(onUpdateCallback, intervalMs = 5000, targetUnitId) {
      const uId = String(targetUnitId || this.unitId || 'u1').toLowerCase();
      if (this.unlockSyncIntervalId) clearInterval(this.unlockSyncIntervalId);
      this.unlockSyncIntervalId = setInterval(async () => {
        try {
          const latestStep = await this.loadGlobalUnlockStep(uId);
          if (latestStep && latestStep !== this.lastKnownUnlockStep) {
            this.lastKnownUnlockStep = latestStep;
            if (typeof onUpdateCallback === 'function') {
              onUpdateCallback(latestStep);
            }
          }
        } catch (e) {}
      }, intervalMs);
    },

    autoSaveIntervalId: null,

    startPeriodicAutoSave(getFormStateFn, intervalMs = 15000, targetUnitId) {
      const uId = String(targetUnitId || this.unitId || 'u1').toLowerCase();
      if (this.autoSaveIntervalId) {
        clearInterval(this.autoSaveIntervalId);
      }

      this.autoSaveIntervalId = setInterval(() => {
        try {
          if (typeof getFormStateFn === 'function') {
            const info = getFormStateFn();
            if (info && info.subStep) {
              this.saveStudentProgress(info.subStep, {
                answerText: info.answerText || '',
                score: info.score || 0
              }, uId);
            }
          }
        } catch (e) {}
      }, intervalMs);
    }
  };

  window.LMSIntegration = LMSIntegration;
  window.LMSIntegrationG1 = LMSIntegration;
})(typeof window !== 'undefined' ? window : globalThis);
