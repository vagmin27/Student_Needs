// Student template
export const createStudent = (data = {}) => ({
  walletAddress: "",
  name: "",
  email: "",
  college: "",
  department: "",
  graduationYear: null,
  resumeFile: null,
  resumeFileName: "",
  resumeHash: "",
  resumeStatus: "unverified",
  submittedAt: "",
  verifiedAt: "",
  verifiedBy: "",
  appliedJobs: [],
  txHash: "",
  verificationTxHash: "",
  ipfsCid: "",
  ipfsUrl: "",
  ...data,
});

// Job template
export const createJob = (data = {}) => ({
  id: "",
  title: "",
  company: "",
  location: "",
  type: "full-time",
  description: "",
  requirements: [],
  vacancy: null,
  postedBy: "",
  postedByName: "",
  postedAt: "",
  applications: [],
  shortlisted: [],
  referred: [],
  txHash: "",
  ipfsCid: "",
  ipfsUrl: "",
  ...data,
});

// Application template
export const createApplication = (data = {}) => ({
  jobId: "",
  studentAddress: "",
  appliedAt: "",
  status: "pending",
  txHash: "",
  ...data,
});

// Referral template
export const createReferral = (data = {}) => ({
  id: "",
  title: "",
  company: "",
  location: "",
  type: "full-time",
  description: "",
  requirements: [],
  vacancy: null,
  postedBy: "",
  postedByName: "",
  postedAt: "",
  applications: [],
  accepted: [],
  txHash: "",
  ipfsCid: "",
  ipfsUrl: "",
  ...data,
});

// Referral Application template
export const createReferralApplication = (data = {}) => ({
  referralId: "",
  studentAddress: "",
  appliedAt: "",
  status: "pending",
  txHash: "",
  ...data,
});