/**
 * Redbook Math App - 영서중 수학 LMS DB Integration SDK
 * Connects directly with Supabase Cloud DB Engine.
 */

(function(window) {
  'use strict';

  const SUPABASE_URL = 'https://agcmetuneycqzhvshmoe.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_r_0ZhunAe99ftol-JqL5qg_ADZ1BH_X';

  const APP_ID = 'redbook_math_2';
  const LOCAL_CACHE_USER_KEY = 'redbook_current_user';
  const LOCAL_CACHE_PROGRESS_PREFIX = 'redbook_progress_';

  let supabaseClient = null;

  function getSupabase() {
    if (!supabaseClient && typeof window.supabase !== 'undefined') {
      try {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      } catch (err) {
        console.warn('⚠️ [LMSIntegration] Supabase init warning:', err);
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

      // Check cached user
      const cached = this.getCurrentUserFromCache();
      if (cached) {
        this.currentUser = cached;
      }

      // Listen for parent LMS postMessage handshake (iframe mode)
      window.addEventListener('message', (event) => {
        if (!event.data || typeof event.data !== 'object') return;
        if (event.data.type === 'MATH_LMS_INIT_STUDENT' && event.data.student) {
          const st = event.data.student;
          this.setCurrentUser({
            id: String(st.id || '').trim(),
            name: String(st.name || '').trim(),
            grade: String(st.grade || '2').trim(),
            classNum: String(st.classNum || st.class_num || '1').trim()
          });
          console.log('⚡ [LMSIntegration] Received student info from parent LMS iframe:', this.currentUser);
          if (this.onStudentLoadedCallback) {
            this.onStudentLoadedCallback(this.currentUser);
          }
        }
      });

      // Request student info if in iframe
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

    /**
     * Authenticate student using Supabase Cloud DB (Google Sheets fallback disconnected per instruction)
     */
    async loginStudent(studentId, password) {
      const cleanId = String(studentId || '').trim();
      const cleanPw = String(password || '').trim();

      if (!cleanId || !cleanPw) {
        return { success: false, message: '학번과 비밀번호를 모두 입력해 주세요.' };
      }

      // Master/Teacher test password check
      if (cleanPw === '661227') {
        const masterUser = {
          id: cleanId,
          name: cleanId === '661227' ? '임종윤 선생님' : `학생 ${cleanId}`,
          grade: '2',
          classNum: '1',
          role: cleanId === '661227' ? 'teacher' : 'student'
        };
        this.setCurrentUser(masterUser);
        return { success: true, user: masterUser, message: '선생님 마스터 비밀번호로 인증되었습니다.' };
      }

      // Query Supabase Cloud DB (Google Sheets disconnected)
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
                grade: String(data.grade || '2'),
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
          console.warn('[LMSIntegration] Supabase login error:', err);
        }
      }

      // Fallback local cache check
      try {
        const cachedStudentsRaw = localStorage.getItem('mathlab_students_cache');
        if (cachedStudentsRaw) {
          const cachedStudents = JSON.parse(cachedStudentsRaw);
          const matched = cachedStudents.find(s => String(s.id).trim() === cleanId);
          if (matched && String(matched.password).trim() === cleanPw) {
            const userObj = {
              id: matched.id,
              name: matched.name,
              grade: String(matched.grade || '2'),
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
     * Load student's saved progress from LMS DB
     */
    async loadStudentProgress(studentId) {
      if (!studentId) return null;
      const cleanId = String(studentId).trim();

      // 1. Try Supabase Cloud DB
      const sb = getSupabase();
      if (sb) {
        try {
          const { data, error } = await sb
            .from('student_progress')
            .select('*')
            .eq('student_id', cleanId)
            .eq('app_id', APP_ID)
            .maybeSingle();

          if (!error && data) {
            const progressObj = {
              lastSubStep: data.sub_step || data.lastSubStep || '1-1',
              completedSteps: Array.isArray(data.completed_steps) ? data.completed_steps : [],
              updatedAt: data.updated_at || ''
            };
            this.saveProgressToLocal(cleanId, progressObj);
            return progressObj;
          }
        } catch (err) {
          console.warn('[LMSIntegration] Supabase load progress error:', err);
        }
      }

      // 2. Fallback to Local Storage
      return this.getProgressFromLocal(cleanId);
    },

    /**
     * Save student progress & real-time activity to Supabase LMS DB
     */
    async saveStudentProgress(subStepCode, data = {}) {
      let cleanId = '20101'; // Default student ID if not set
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
        lastSubStep: subStepCode || '1-1',
        completedSteps: updatedCompleted,
        updatedAt: new Date().toISOString()
      };

      this.saveProgressToLocal(cleanId, progressObj);

      // Save to Supabase (Fail-safe select -> update/insert pattern)
      const sb = getSupabase();
      if (sb) {
        try {
          // 1. Check existing record
          const { data: existingProgress } = await sb
            .from('student_progress')
            .select('id')
            .eq('student_id', cleanId)
            .eq('app_id', APP_ID)
            .maybeSingle();

          if (existingProgress && existingProgress.id) {
            // Update
            await sb.from('student_progress').update({
              sub_step: subStepCode || '1-1',
              completed_steps: updatedCompleted,
              updated_at: new Date().toISOString()
            }).eq('id', existingProgress.id);
          } else {
            // Insert
            await sb.from('student_progress').insert({
              student_id: cleanId,
              app_id: APP_ID,
              sub_step: subStepCode || '1-1',
              completed_steps: updatedCompleted,
              updated_at: new Date().toISOString()
            });
          }
          console.log(`⚡ [Supabase Sync] Progress updated for student ${cleanId} at step [${subStepCode}]`);
        } catch (err) {
          console.warn('⚠️ [LMSIntegration] Supabase progress save fallback:', err);
        }
      }

      // Record activity submission log to Supabase Cloud DB
      const activityTitle = data.activityTitle || `Redbook 수학 탐구 [단계: ${subStepCode}]`;
      const answerText = data.answerText || '';
      const score = typeof data.score === 'number' ? data.score : 0;

      const payload = {
        student_id: cleanId,
        student_name: studentName,
        grade: 2,
        class_num: 1,
        activity_title: activityTitle,
        answer_text: answerText,
        score: score,
        submitted_at: new Date().toISOString()
      };

      if (sb) {
        try {
          const { error: subErr } = await sb.from('activity_submissions').insert(payload);
          if (!subErr) {
            console.log(`⚡ [Supabase Sync] Activity submission saved for ${cleanId}: [${activityTitle}]`);
          } else {
            console.warn('⚠️ [LMSIntegration] Activity submission insert warning:', subErr.message);
          }
        } catch (e) {
          console.warn('⚠️ [LMSIntegration] Activity submission error:', e);
        }
      }

      // Post message to parent LMS if in iframe
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

    /**
     * Start silent periodic auto-save (No popups, background DB sync every 15s)
     */
    autoSaveIntervalId: null,

    startPeriodicAutoSave(getFormStateFn, intervalMs = 15000) {
      if (this.autoSaveIntervalId) {
        clearInterval(this.autoSaveIntervalId);
      }

      console.log(`⏱️ [LMSIntegration] Silent periodic auto-save started (Interval: ${intervalMs / 1000}s)`);

      this.autoSaveIntervalId = setInterval(() => {
        try {
          if (typeof getFormStateFn === 'function') {
            const info = getFormStateFn();
            if (info && info.subStep) {
              this.saveStudentProgress(info.subStep, {
                activityTitle: `[정기 자동저장] 단계 ${info.subStep}`,
                answerText: info.answerText || '',
                score: info.score || 0
              });
            }
          }
        } catch (e) {
          console.warn('[LMSIntegration] Auto save tick error:', e);
        }
      }, intervalMs);
    }
  };

  window.LMSIntegration = LMSIntegration;
})(window);
