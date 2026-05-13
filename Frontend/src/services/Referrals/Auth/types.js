// Authentication Types

/**
 * @typedef {'Student' | 'Alumni' | 'Verifier'} AccountType
 */

// Base user documentation
/**
 * @typedef {Object} BaseUser
 * @property {string} _id
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {AccountType} accountType
 * @property {string} image
 * @property {Object} college
 * @property {string} college._id
 * @property {string} college.name
 * @property {string} college.matchingName
 * @property {string} token
 */

// Student specific user
/**
 * @typedef {BaseUser & Object} StudentUser
 * @property {'Student'} accountType
 * @property {string} [branch]
 * @property {number} [graduationYear]
 * @property {string[]} [skills]
 * @property {Array<{title: string, description: string, link?: string}>} [projects]
 * @property {Array<{name: string, issuer: string, date?: string}>} [certifications]
 * @property {string[]} [preferredRoles]
 * @property {{url: string, publicId: string}} [resume]
 * @property {number} [profileCompleteness]
 */

// Alumni specific user
/**
 * @typedef {BaseUser & Object} AlumniUser
 * @property {'Alumni'} accountType
 * @property {string} [company]
 * @property {string} [jobTitle]
 * @property {number} [yearsOfExperience]
 * @property {string[]} [skills]
 * @property {string} [referralPreferences]
 */

// Verifier specific user
/**
 * @typedef {BaseUser & Object} VerifierUser
 * @property {'Verifier'} accountType
 * @property {string} [verifierRole]
 * @property {string} [department]
 */

/**
 * @typedef {StudentUser | AlumniUser | VerifierUser} AuthUser
 */

// Signup request payloads
/**
 * @typedef {Object} StudentSignupPayload
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {string} password
 * @property {string} collegeName
 */

/**
 * @typedef {Object} AlumniSignupPayload
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {string} password
 * @property {string} collegeName
 * @property {string} [company]
 * @property {string} [jobTitle]
 */

// Login request payload
/**
 * @typedef {Object} LoginPayload
 * @property {string} email
 * @property {string} password
 */

// API Response types
/**
 * @typedef {Object} AuthResponse
 * @property {boolean} success
 * @property {string} message
 * @property {string} [token]
 * @property {AuthUser} [user]
 */

/**
 * @typedef {Object} AuthError
 * @property {false} success
 * @property {string} message
 */

// Auth context state
/**
 * @typedef {Object} AuthState
 * @property {AuthUser | null} user
 * @property {string | null} token
 * @property {boolean} isAuthenticated
 * @property {boolean} isLoading
 * @property {string | null} error
 */