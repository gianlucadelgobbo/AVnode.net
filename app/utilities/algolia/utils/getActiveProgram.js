// 📁 app/utilities/algolia/utils/getActiveProgram.js

export const getActiveProgram = (event) => {
  if (Array.isArray(event.program_freezed) && event.program_freezed.length > 0) {
    return { program: event.program_freezed, source: 'freezed' };
  }
  if (Array.isArray(event.program) && event.program.length > 0) {
    return { program: event.program, source: 'live' };
  }
  return { program: [], source: null };
};
