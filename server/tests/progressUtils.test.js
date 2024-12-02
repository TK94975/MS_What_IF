// tests/helpers.test.js

const { calculateRequirement } = require('../utils/progressUtils');
const { convertGrade } = require('../utils/progressUtils');

describe('calculateRequirement', () => {
  test('should correctly calculate completed credits and GPA', () => {
    const userCourses = [
      { course_id: 1, credits: 3, grade: 'A' },
      { course_id: 2, credits: 3, grade: 'B+' },
    ];

    const requiredCourseIds = [1, 2, 3];
    const requiredCredits = 6;

    const result = calculateRequirement(userCourses, requiredCourseIds, requiredCredits);

    expect(result.completed_credits).toBe(6);
    expect(result.courses.length).toBe(2);
    expect(result.gpa).toBeCloseTo(3.65, 1);
  });

  test('should return correct grade points for valid grades', () => {
    expect(convertGrade('A')).toBeCloseTo(4, 3);
    expect(convertGrade('A-')).toBeCloseTo(3.7,3);
    expect(convertGrade('B+')).toBeCloseTo(3.3,3);
    expect(convertGrade('B')).toBeCloseTo(3.0,3);
    expect(convertGrade('B-')).toBeCloseTo(2.7,3);
    expect(convertGrade('C+')).toBeCloseTo(2.3,3);
    expect(convertGrade('C')).toBeCloseTo(2.0,3);
    expect(convertGrade('F')).toBeCloseTo(0.0,3);
  });


  test('should return 0.0 for invalid or unknown grades', () => {
    expect(convertGrade('Z')).toBeCloseTo(0.0);
    expect(convertGrade('P')).toBeCloseTo(0.0);
    expect(convertGrade('')).toBeCloseTo(0.0);
    expect(convertGrade(null)).toBeCloseTo(0.0);
    expect(convertGrade(undefined)).toBeCloseTo(0.0);
  });

});
