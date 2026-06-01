import { TutorAttendanceService } from "../../services/TutorAttendanceService.js";
import { catchAsync } from "../../utils/catchAsync.js";
import {
  validateRequest,
  sessionQuerySchema,
  markSessionSchema,
  studentHistoryQuerySchema,
  tutorSubjectBodySchema,
  enrolledQuerySchema,
} from "../../validations/tutorAttendance.validation.js";

export const getTutorSubjects = catchAsync(async (req, res) => {
  const subjects = await TutorAttendanceService.getTutorSubjects(req.user);
  res.status(200).json(subjects);
});

export const createTutorSubject = catchAsync(async (req, res) => {
  const { isValid, data, errorResponse } = validateRequest(
    tutorSubjectBodySchema,
    req.body
  );
  if (!isValid) return res.status(400).json(errorResponse);

  const subject = await TutorAttendanceService.createTutorSubject(req.user, data);
  res.status(201).json({ message: "Subject created", subject });
});

export const updateTutorSubject = catchAsync(async (req, res) => {
  const { isValid, data, errorResponse } = validateRequest(
    tutorSubjectBodySchema,
    req.body
  );
  if (!isValid) return res.status(400).json(errorResponse);

  const subject = await TutorAttendanceService.updateTutorSubject(
    req.user,
    req.params.id,
    data
  );
  res.status(200).json({ message: "Subject updated", subject });
});

export const deleteTutorSubject = catchAsync(async (req, res) => {
  const result = await TutorAttendanceService.deleteTutorSubject(
    req.user,
    req.params.id
  );
  res.status(200).json(result);
});

export const getEnrolledStudents = catchAsync(async (req, res) => {
  const { isValid, data, errorResponse } = validateRequest(
    enrolledQuerySchema,
    req.query
  );
  if (!isValid) return res.status(400).json(errorResponse);

  const result = await TutorAttendanceService.getEnrolledStudents(
    req.user,
    data
  );
  res.status(200).json(result);
});

export const getSessionRecords = catchAsync(async (req, res) => {
  const { isValid, data, errorResponse } = validateRequest(
    sessionQuerySchema,
    req.query
  );
  if (!isValid) return res.status(400).json(errorResponse);

  const records = await TutorAttendanceService.getSessionRecords(req.user, data);
  res.status(200).json(records);
});

export const markSessionAttendance = catchAsync(async (req, res) => {
  const { isValid, data, errorResponse } = validateRequest(
    markSessionSchema,
    req.body
  );
  if (!isValid) return res.status(400).json(errorResponse);

  const result = await TutorAttendanceService.markSessionAttendance(
    req.user,
    data
  );
  res.status(200).json(result);
});

export const getStudentSummary = catchAsync(async (req, res) => {
  const summary = await TutorAttendanceService.getStudentSummary(req.user);
  res.status(200).json(summary);
});

export const getStudentHistory = catchAsync(async (req, res) => {
  const { isValid, data, errorResponse } = validateRequest(
    studentHistoryQuerySchema,
    req.query
  );
  if (!isValid) return res.status(400).json(errorResponse);

  const history = await TutorAttendanceService.getStudentHistory(
    req.user,
    data
  );
  res.status(200).json(history);
});
