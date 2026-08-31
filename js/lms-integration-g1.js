/**
 * Redbook Math App - 영서중 수학 1학년 (좌표평면과 그래프) LMS DB Integration SDK
 * Connects directly with Supabase Cloud DB Engine & Cross-Device Cloud Sync Store.
 */

(function(window) {
  'use strict';

  const SUPABASE_URL = 'https://agcmetuneycqzhvshmoe.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_r_0ZhunAe99ftol-JqL5qg_ADZ1BH_X';

  const APP_ID = 'math_1_coordinate_graph';
  const LOCAL_CACHE_USER_KEY = 'redbook_g1_current_user';
  const LOCAL_CACHE_PROGRESS_PREFIX = 'redbook_g1_progress_';

  const CLOUD_CONFIG_URL = 'https://api.restful-api.dev/objects/ff8081819ff5b11001a041dff6792f8d';
  const CLOUD_STUDENTS_PROGRESS_URL = 'https://api.restful-api.dev/objects/ff8081819ff5b11001a04706669e41aa';

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
    currentUser: null,
    onStudentLoadedCallback: null,

    init(options) {
      options = options || {};
      if (typeof options.onStudentLoaded === 'function') {
        this.onStudentLoadedCallback = options.onStudentLoaded;
      }

      const cached = this.getCurrentUserFromCache();
      if (cached) {
        this.currentUser = cached;
      }

      window.addEventListener('message', (event) => {
        if (!event.data || typeof event.data !== 'object') return;
        if (event.data.type === 'MATH_LMS_INIT_STUDENT' && event.data.student) {
          const st = event.data.student;
          this.setCurrentUser({
            id: String(st.id || '').trim(),
            name: String(st.name || '').trim(),
            grade: String(st.grade || '1').trim(),
            classNum: String(st.classNum || st.class_num || '1').trim()
          });
          if (this.onStudentLoadedCallback) {
            this.onStudentLoadedCallback(this.currentUser);
          }
        }
      });

      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'MATH_LMS_REQUEST_STUDENT_INFO' }, '*');
      }
    },

    getCurrentUserFromCache() {
      try {
        const raw = localStorage.getItem(LOCAL_CACHE_USER_KEY);
        if (raw) return JSON.parse(raw);
      } catch (e) {}
      return null;
    },

    setCurrentUser(userObj) {
      this.currentUser = userObj;
      try {
        if (userObj) {
          localStorage.setItem(LOCAL_CACHE_USER_KEY, JSON.stringify(userObj));
        } else {
          localStorage.removeItem(LOCAL_CACHE_USER_KEY);
        }
      } catch (e) {}
    },

    async loginStudent(studentId, password) {
      const cleanId = String(studentId || '').trim();
      const cleanPw = String(password || '').trim();

      if (!cleanId || !cleanPw) {
        return { success: false, message: '학번과 비밀번호를 모두 입력해 주세요.' };
      }

      if (cleanPw === '260523' || cleanPw === '260831') {
        const isMasterId = (cleanId === '260523' || cleanId === '260831');
        const masterUser = {
          id: cleanId,
          name: isMasterId ? '임종윤 선생님' : `학생 ${cleanId}`,
          grade: '1',
          classNum: '1',
          role: isMasterId ? 'teacher' : 'student'
        };
        this.setCurrentUser(masterUser);
        return { success: true, user: masterUser, message: '선생님 마스터 비밀번호로 인증되었습니다.' };
      }

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
                classNum: String(data.class_num || '1'),
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
              classNum: String(matched.classNum || '1'),
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
     * Load student's saved progress from LMS Cloud DB & Supabase Backup (cross-device)
     */
    async loadStudentProgress(studentId) {
      if (!studentId) return null;
      const cleanId = String(studentId).trim();
      const key = `${cleanId}_g1`;

      // 1. Try Cloud DB (Cross-device shared store)
      try {
        const res = await fetch(CLOUD_STUDENTS_PROGRESS_URL);
        if (res.ok) {
          const json = await res.json();
          if (json && json.data && json.data.records && json.data.records[key]) {
            const rec = json.data.records[key];
            const progressObj = {
              lastSubStep: rec.lastSubStep || '0-1',
              completedSteps: Array.isArray(rec.completedSteps) ? rec.completedSteps : [],
              updatedAt: rec.updatedAt || ''
            };
            this.saveProgressToLocal(cleanId, progressObj);
            console.log(`🌐 [LMS Cloud DB] Loaded G1 student progress for ${key}:`, progressObj);
            return progressObj;
          }
        }
      } catch (err) {
        console.warn('[LMS Cloud DB] Error loading G1 student progress:', err);
      }

      // 2. Try Supabase activity submissions backup
      const sb = getSupabase();
      if (sb) {
        try {
          const { data, error } = await sb
            .from('activity_submissions')
            .select('*')
            .eq('student_id', cleanId)
            .eq('grade', 1)
            .order('submitted_at', { ascending: false })
            .limit(20);

          if (!error && Array.isArray(data) && data.length > 0) {
            const completedSteps = [];
            let latestStep = '0-1';
            data.forEach((sub, idx) => {
              const match = String(sub.activity_title || '').match(/단계:\s*([0-9]-[0-9])/);
              if (match && match[1]) {
                const s = match[1];
                if (idx === 0) latestStep = s;
                if (!completedSteps.includes(s)) completedSteps.push(s);
              }
            });

            if (latestStep !== '0-1' || completedSteps.length > 0) {
              const progressObj = {
                lastSubStep: latestStep,
                completedSteps: completedSteps,
                updatedAt: data[0].submitted_at || new Date().toISOString()
              };
              this.saveProgressToLocal(cleanId, progressObj);
              console.log(`🌐 [Supabase Backup] Restored G1 student progress for ${cleanId}:`, progressObj);
              return progressObj;
            }
          }
        } catch (sbErr) {
          console.warn('[Supabase Backup] Error loading G1 student progress:', sbErr);
        }
      }

      // 3. Fallback to Local Storage
      return this.getProgressFromLocal(cleanId);
    },

    /**
     * Save student progress & real-time activity to LMS Cloud DB & Supabase (cross-device)
     */
    async saveStudentProgress(subStepCode, data = {}) {
      let cleanId = '10101';
      let studentName = '학생';

      if (this.currentUser && this.currentUser.id) {
        cleanId = String(this.currentUser.id).trim();
        studentName = this.currentUser.name || `학생 ${cleanId}`;
      } else {
        const cachedUser = this.getCurrentUserFromCache();
        if (cachedUser && cachedUser.id) {
          cleanId = String(cachedUser.id).trim();
          studentName = cachedUser.name || `학생 ${cleanId}`;
        }
      }

      const existing = this.getProgressFromLocal(cleanId) || { completedSteps: [] };
      const completedSet = new Set(existing.completedSteps || []);
      if (subStepCode) completedSet.add(subStepCode);
      const updatedCompleted = Array.from(completedSet);

      const progressObj = {
        lastSubStep: subStepCode || '0-1',
        completedSteps: updatedCompleted,
        updatedAt: new Date().toISOString()
      };

      // 1. Save to local cache
      this.saveProgressToLocal(cleanId, progressObj);

      // 2. Save to Cloud DB for cross-device synchronization
      try {
        const key = `${cleanId}_g1`;
        let records = {};
        try {
          const getRes = await fetch(CLOUD_STUDENTS_PROGRESS_URL);
          if (getRes.ok) {
            const json = await getRes.json();
            if (json && json.data && json.data.records) records = json.data.records;
          }
        } catch (e) {}

        records[key] = {
          studentId: cleanId,
          studentName: studentName,
          lastSubStep: subStepCode || '0-1',
          completedSteps: updatedCompleted,
          updatedAt: new Date().toISOString()
        };

        const putRes = await fetch(CLOUD_STUDENTS_PROGRESS_URL, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'redbook_students_progress_cloud_store_v1',
            data: { records, updatedAt: Date.now() }
          })
        });

        if (!putRes.ok && putRes.status === 404) {
          await fetch('https://api.restful-api.dev/objects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: 'redbook_students_progress_cloud_store_v1',
              data: { records, updatedAt: Date.now() }
            })
          });
        }
        console.log(`🌐 [LMS Cloud DB] Saved G1 progress for ${key}:`, records[key]);
      } catch (err) {
        console.warn('[LMS Cloud DB] Save error:', err);
      }

      // 3. Record activity submission log to Supabase Cloud DB
      const activityTitle = data.activityTitle || `중1 좌표평면 탐구 [단계: ${subStepCode}]`;
      const answerText = data.answerText || '';
      const score = typeof data.score === 'number' ? data.score : 0;

      const payload = {
        student_id: cleanId,
        student_name: studentName,
        grade: 1,
        class_num: parseInt(cleanId.slice(2, 3)) || 1,
        activity_title: activityTitle,
        answer_text: answerText,
        score: score,
        submitted_at: new Date().toISOString()
      };

      const sb = getSupabase();
      if (sb) {
        try {
          await sb.from('activity_submissions').insert(payload);
        } catch (e) {}
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

    getProgressFromLocal(studentId) {
      try {
        const raw = localStorage.getItem(LOCAL_CACHE_PROGRESS_PREFIX + studentId);
        if (raw) return JSON.parse(raw);
      } catch (e) {}
      return null;
    },

    saveProgressToLocal(studentId, progressObj) {
      try {
        localStorage.setItem(LOCAL_CACHE_PROGRESS_PREFIX + studentId, JSON.stringify(progressObj));
      } catch (e) {}
    },

    async saveGlobalUnlockStep(stepCode) {
      const cleanStep = String(stepCode || '0-1').trim();
      try {
        localStorage.setItem('redbook_g1_global_unlock_step', cleanStep);
      } catch (e) {}

      // 1. Primary: Supabase DB Dedicated Unlock Record
      const sb = getSupabase();
      if (sb) {
        try {
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
          console.log('🏛️ [Supabase DB] Grade 1 unlock step saved to primary DB:', cleanStep);
        } catch (e) {
          console.warn('[Supabase DB] Save error:', e);
        }
      }

      // 2. Secondary Cloud DB Sync (api.restful-api.dev live shared store)
      try {
        let currentData = { g1: '0-1', g2: '0-1' };
        try {
          const getRes = await fetch(CLOUD_CONFIG_URL);
          if (getRes.ok) {
            const json = await getRes.json();
            if (json && json.data) currentData = json.data;
          }
        } catch (e) {}

        currentData.g1 = cleanStep;
        currentData.updatedAt = Date.now();
        currentData.updatedBy = (this.currentUser && this.currentUser.name) ? this.currentUser.name : 'teacher_admin';

        const putRes = await fetch(CLOUD_CONFIG_URL, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'redbook_unlock_config',
            data: currentData
          })
        });

        if (!putRes.ok && putRes.status === 404) {
          await fetch('https://api.restful-api.dev/objects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: 'redbook_unlock_config',
              data: currentData
            })
          });
        }
      } catch (err) {
        console.warn('[LMS Cloud DB] Save error:', err);
      }
    },

    async saveGlobalUnlockBatch(configObj) {
      if (!configObj || typeof configObj !== 'object') return;
      const g1Step = configObj.g1 ? String(configObj.g1).trim() : null;
      const g2Step = configObj.g2 ? String(configObj.g2).trim() : null;

      if (g1Step) {
        try { localStorage.setItem('redbook_g1_global_unlock_step', g1Step); } catch (e) {}
      }
      if (g2Step) {
        try { localStorage.setItem('redbook_g2_global_unlock_step', g2Step); } catch (e) {}
      }

      // 1. Primary: Supabase DB Batch Save
      const sb = getSupabase();
      if (sb) {
        if (g1Step) {
          try {
            await sb.from('activity_submissions').insert({
              student_id: 'SYS_UNLOCK_G1',
              student_name: '교사 관리자',
              grade: 1,
              class_num: 0,
              activity_title: 'SYS_UNLOCK_G1',
              answer_text: g1Step,
              score: 100,
              submitted_at: new Date().toISOString()
            });
          } catch (e) {}
        }
        if (g2Step) {
          try {
            await sb.from('activity_submissions').insert({
              student_id: 'SYS_UNLOCK_G2',
              student_name: '교사 관리자',
              grade: 2,
              class_num: 0,
              activity_title: 'SYS_UNLOCK_G2',
              answer_text: g2Step,
              score: 100,
              submitted_at: new Date().toISOString()
            });
          } catch (e) {}
        }
        console.log('🏛️ [Supabase DB] Batch unlock steps saved to primary DB:', { g1: g1Step, g2: g2Step });
      }

      // 2. Secondary: Cloud DB Atomic Update
      try {
        let currentData = { g1: '0-1', g2: '0-1' };
        try {
          const getRes = await fetch(CLOUD_CONFIG_URL);
          if (getRes.ok) {
            const json = await getRes.json();
            if (json && json.data) currentData = json.data;
          }
        } catch (e) {}

        if (g1Step) currentData.g1 = g1Step;
        if (g2Step) currentData.g2 = g2Step;
        currentData.updatedAt = Date.now();
        currentData.updatedBy = (this.currentUser && this.currentUser.name) ? this.currentUser.name : 'teacher_admin';

        await fetch(CLOUD_CONFIG_URL, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'redbook_unlock_config',
            data: currentData
          })
        });
      } catch (err) {
        console.warn('[LMS Cloud DB] Batch save error:', err);
      }
    },

    async loadGlobalUnlockStep() {
      let savedStep = '0-1';
      try {
        savedStep = localStorage.getItem('redbook_g1_global_unlock_step') || '0-1';
      } catch (e) {}

      // 1. Primary Priority: Supabase DB Dedicated Unlock Record
      const sb = getSupabase();
      if (sb) {
        try {
          const { data, error } = await sb
            .from('activity_submissions')
            .select('*')
            .eq('student_id', 'SYS_UNLOCK_G1')
            .order('id', { ascending: false })
            .limit(1);

          if (!error && Array.isArray(data) && data.length > 0 && data[0].answer_text) {
            const dbStep = String(data[0].answer_text).trim();
            if (dbStep) {
              try { localStorage.setItem('redbook_g1_global_unlock_step', dbStep); } catch (e) {}
              return dbStep;
            }
          }
        } catch (e) {
          console.warn('[Supabase DB] Load unlock step error:', e);
        }
      }

      // 2. Secondary Fallback: Query live Cloud DB
      try {
        const res = await fetch(CLOUD_CONFIG_URL);
        if (res.ok) {
          const json = await res.json();
          if (json && json.data && json.data.g1) {
            const cloudStep = String(json.data.g1).trim();
            try { localStorage.setItem('redbook_g1_global_unlock_step', cloudStep); } catch (e) {}
            return cloudStep;
          }
        }
      } catch (err) {
        console.warn('[LMS Cloud DB] Load error:', err);
      }

      return savedStep;
    },

    lastKnownUnlockStep: null,
    unlockSyncIntervalId: null,

    startUnlockBoundarySync(onUpdateCallback, intervalMs = 5000) {
      if (this.unlockSyncIntervalId) clearInterval(this.unlockSyncIntervalId);
      this.unlockSyncIntervalId = setInterval(async () => {
        try {
          const latestStep = await this.loadGlobalUnlockStep();
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

    startPeriodicAutoSave(getFormStateFn, intervalMs = 15000) {
      if (this.autoSaveIntervalId) {
        clearInterval(this.autoSaveIntervalId);
      }

      this.autoSaveIntervalId = setInterval(() => {
        try {
          if (typeof getFormStateFn === 'function') {
            const info = getFormStateFn();
            if (info && info.subStep) {
              this.saveStudentProgress(info.subStep, {
                activityTitle: `[중1 좌표평면 자동저장] 단계 ${info.subStep}`,
                answerText: info.answerText || '',
                score: info.score || 0
              });
            }
          }
        } catch (e) {}
      }, intervalMs);
    }
  };

  window.LMSIntegration = LMSIntegration;
  window.LMSIntegrationG1 = LMSIntegration;
})(typeof window !== 'undefined' ? window : globalThis);
