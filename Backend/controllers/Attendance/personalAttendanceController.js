import { PersonalAttendanceService } from "../../services/PersonalAttendanceService.js";
import { catchAsync } from "../../utils/catchAsync.js";
import {
  validateRequest,
  createSubjectSchema,
  updateSubjectSchema,
  markRecordSchema,
  updateRecordSchema,
  recordsQuerySchema,
} from "../../validations/personalAttendance.validation.js";

const resolveUserId = (req) => {
  req.userId = (req.user?._id || req.user?.id)?.toString();
};

export const getMySubjects = catchAsync(async (req, res) => {
  resolveUserId(req);
  const subjects = await PersonalAttendanceService.getSubjects(req.user);
  res.status(200).json(subjects);
});

export const createMySubject = catchAsync(async (req, res) => {
  const { isValid, data, errorResponse } = validateRequest(createSubjectSchema, req.body);
  if (!isValid) return res.status(400).json(errorResponse);

  const subject = await PersonalAttendanceService.createSubject(req.user, data);
  res.status(201).json({ message: "Subject created", subject });
});

export const updateMySubject = catchAsync(async (req, res) => {
  const { isValid, data, errorResponse } = validateRequest(updateSubjectSchema, req.body);
  if (!isValid) return res.status(400).json(errorResponse);

  const subject = await PersonalAttendanceService.updateSubject(
    req.user,
    req.params.id,
    data
  );
  res.status(200).json({ message: "Subject updated", subject });
});

export const deleteMySubject = catchAsync(async (req, res) => {
  const result = await PersonalAttendanceService.deleteSubject(req.user, req.params.id);
  res.status(200).json(result);
});

export const getAttendanceStats = catchAsync(async (req, res) => {
  const { isValid, data, errorResponse } = validateRequest(recordsQuerySchema, req.query);
  if (!isValid) return res.status(400).json(errorResponse);

  const stats = await PersonalAttendanceService.getStats(req.user, data);
  res.status(200).json(stats);
});

export const getAttendanceRecords = catchAsync(async (req, res) => {
  const { isValid, data, errorResponse } = validateRequest(recordsQuerySchema, req.query);
  if (!isValid) return res.status(400).json(errorResponse);

  const records = await PersonalAttendanceService.getRecords(req.user, data);
  res.status(200).json(records);
});

export const markAttendanceRecord = catchAsync(async (req, res) => {
  const { isValid, data, errorResponse } = validateRequest(markRecordSchema, req.body);
  if (!isValid) return res.status(400).json(errorResponse);

  const record = await PersonalAttendanceService.markRecord(req.user, data);
  res.status(201).json({ message: "Attendance marked", record });
});

export const updateAttendanceRecord = catchAsync(async (req, res) => {
  const { isValid, data, errorResponse } = validateRequest(updateRecordSchema, req.body);
  if (!isValid) return res.status(400).json(errorResponse);

  const record = await PersonalAttendanceService.updateRecord(
    req.user,
    req.params.id,
    data
  );
  res.status(200).json({ message: "Attendance updated", record });
});

export const deleteAttendanceRecord = catchAsync(async (req, res) => {
  const result = await PersonalAttendanceService.deleteRecord(req.user, req.params.id);
  res.status(200).json(result);
});

export const getStudentAttendance = catchAsync(async (req, res) => {
  const records = await PersonalAttendanceService.getStudentAttendanceList(req.user);
  res.status(200).json(records);
});
