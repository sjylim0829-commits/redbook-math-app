/**
 * Redbook Math App - 영서중 수학 1학년 (좌표평면과 그래프) LMS DB Integration SDK
 * Connects directly with Supabase Cloud DB Engine.
 */

(function(window) {
  'use strict';

  const SUPABASE_URL = 'https://agcmetuneycqzhvshmoe.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_r_0ZhunAe99ftol-JqL5qg_ADZ1BH_X';

  const APP_ID = 'math_1_coordinate_graph';
  const LOCAL_CACHE_USER_KEY = 'redbook_g1_current_user';
  const LOCAL_CACHE_PROGRESS_PREFIX = 'redbook_g1_progress_';

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

      if (cleanPw === '950420') {
        const isMasterId = (cleanId === '950420');
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

    async loadStudentProgress(studentId) {
      if (!studentId) return null;
      const cleanId = String(studentId).trim();

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
          console.warn('[LMSIntegration-G1] Supabase load progress error:', err);
        }
      }

      return this.getProgressFromLocal(cleanId);
    },

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
        lastSubStep: subStepCode || '1-1',
        completedSteps: updatedCompleted,
        updatedAt: new Date().toISOString()
      };

      this.saveProgressToLocal(cleanId, progressObj);

      const sb = getSupabase();
      if (sb) {
        try {
          const { data: existingProgress } = await sb
            .from('student_progress')
            .select('id')
            .eq('student_id', cleanId)
            .eq('app_id', APP_ID)
            .maybeSingle();

          if (existingProgress && existingProgress.id) {
            await sb.from('student_progress').update({
              sub_step: subStepCode || '1-1',
              completed_steps: updatedCompleted,
              updated_at: new Date().toISOString()
            }).eq('id', existingProgress.id);
          } else {
            await sb.from('student_progress').insert({
              student_id: cleanId,
              app_id: APP_ID,
              sub_step: subStepCode || '1-1',
              completed_steps: updatedCompleted,
              updated_at: new Date().toISOString()
            });
          }
        } catch (err) {
          console.warn('⚠️ [LMSIntegration-G1] Supabase progress save fallback:', err);
        }
      }

      const activityTitle = data.activityTitle || `중1 좌표평면 탐구 [단계: ${subStepCode}]`;
      const answerText = data.answerText || '';
      const score = typeof data.score === 'number' ? data.score : 0;

      const payload = {
        student_id: cleanId,
        student_name: studentName,
        grade: 1,
        class_num: 1,
        activity_title: activityTitle,
        answer_text: answerText,
        score: score,
        submitted_at: new Date().toISOString()
      };

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
})(window);
