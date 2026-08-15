/**
 * Redbook Math App - Monday LMS DB Integration SDK
 * Connects directly with Supabase Cloud DB and Google Sheets WebApp Endpoint.
 */

(function(window) {
  'use strict';

  const SUPABASE_URL = 'https://agcmetuneycqzhvshmoe.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_r_0ZhunAe99ftol-JqL5qg_ADZ1BH_X';
  const GAS_ENDPOINT_URL = 'https://script.google.com/macros/s/AKfycbxnxVFfw9oeqks1lrDj_SgrS8ltk7HGdcmfA98BlLxf3f7PdC9M47LETlV6JuAbOJ8E/exec';

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
     * Authenticate student using LMS DB credentials
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

      // 1. Query Supabase Cloud DB
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

      // 2. Query GAS WebApp fallback
      try {
        const res = await fetch(`${GAS_ENDPOINT_URL}?action=verify_student&id=${encodeURIComponent(cleanId)}&pw=${encodeURIComponent(cleanPw)}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.student) {
            const userObj = {
              id: String(json.student.id).trim(),
              name: String(json.student.name).trim(),
              grade: String(json.student.grade || '2'),
              classNum: String(json.student.classNum || '1'),
              role: 'student'
            };
            this.setCurrentUser(userObj);
            return { success: true, user: userObj, message: `환영합니다, ${userObj.name}님!` };
          }
        }
      } catch (e) {}

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

      return { success: false, message: '등록되지 않은 학번이거나 비밀번호가 올바르지 않습니다.' };
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
     * Save student progress to LMS DB
     */
    async saveStudentProgress(subStepCode, data = {}) {
      if (!this.currentUser || !this.currentUser.id) return;
      const cleanId = String(this.currentUser.id).trim();

      const existing = this.getProgressFromLocal(cleanId) || { completedSteps: [] };
      const completedSet = new Set(existing.completedSteps || []);
      completedSet.add(subStepCode);
      const updatedCompleted = Array.from(completedSet);

      const progressObj = {
        lastSubStep: subStepCode,
        completedSteps: updatedCompleted,
        updatedAt: new Date().toISOString()
      };

      this.saveProgressToLocal(cleanId, progressObj);

      // Save to Supabase
      const sb = getSupabase();
      if (sb) {
        try {
          await sb.from('student_progress').upsert({
            student_id: cleanId,
            app_id: APP_ID,
            sub_step: subStepCode,
            completed_steps: updatedCompleted,
            updated_at: new Date().toISOString()
          }, { onConflict: 'student_id,app_id' });
        } catch (err) {
          console.warn('[LMSIntegration] Supabase progress save error:', err);
        }
      }

      // Post submission if activity details provided
      if (data.activityTitle || data.answerText) {
        const payload = {
          student_id: cleanId,
          student_name: this.currentUser.name,
          grade: Number(this.currentUser.grade || 2),
          class_num: Number(this.currentUser.classNum || 1),
          activity_title: data.activityTitle || document.title || 'Redbook 수학 탐구',
          answer_text: data.answerText || '',
          score: typeof data.score === 'number' ? data.score : 100,
          submitted_at: new Date().toISOString()
        };

        if (sb) {
          try {
            await sb.from('activity_submissions').insert(payload);
          } catch (e) {}
        }

        // Post message to parent LMS if in iframe
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({
            type: 'MATH_LMS_SUBMIT',
            activityTitle: payload.activity_title,
            answerText: payload.answer_text,
            score: payload.score,
            submittedAt: payload.submitted_at
          }, '*');
        }
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
    }
  };

  window.LMSIntegration = LMSIntegration;
})(window);
