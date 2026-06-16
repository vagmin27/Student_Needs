import Student from "../../models/Referrals/StudentModel.js";
import Alumni from "../../models/Referrals/AlumniModel.js";
import Tutor from "../../models/Tutorials/Tutor.js";
import College from "../../models/Referrals/CollegeModel.js";
import crypto from "crypto";
import bcrypt from "bcrypt";

export const getModelByRole = (role) => {
  switch (role) {
    case "alumni":
      return Alumni;
    case "tutor":
      return Tutor;
    case "student":
    default:
      return Student;
  }
};

export const mapOAuthProfileToRole = async (role, profile, email) => {
  const displayName = profile.displayName || "User";
  const firstName = profile.name?.givenName || displayName.split(" ")[0];
  const lastName = profile.name?.familyName || displayName.split(" ").slice(1).join(" ") || (role === "alumni" ? "Alumni" : role === "tutor" ? "Tutor" : "Student");
  
  const randomPassword = crypto.randomBytes(16).toString("hex");
  const hashedPassword = await bcrypt.hash(randomPassword, 10);
  
  const baseProfile = {
    email,
    password: hashedPassword,
    isVerified: true,
    provider: profile.provider,
    providerId: profile.id,
  };

  if (role === "tutor") {
    return {
      ...baseProfile,
      name: displayName,
      fName: firstName,
      lName: lastName,
      profilePic: profile.photos?.[0]?.value || `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}`,
    };
  } else if (role === "alumni") {
    const collegeName = "Default College";
    const matchingName = "defaultcollege";
    let college = await College.findOne({ matchingName });
    if (!college) {
      college = await College.create({
        name: collegeName,
        matchingName,
        Student: [],
        Alumni: [],
      });
    }
    return {
      ...baseProfile,
      firstName,
      lastName,
      accountType: "alumni",
      college: college._id,
      image: profile.photos?.[0]?.value || `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}`,
    };
  } else {
    return {
      ...baseProfile,
      firstName,
      lastName,
      accountType: "student",
      image: profile.photos?.[0]?.value || `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}`,
    };
  }
};

export const buildJwtPayload = (role, user) => {
  return {
    id: user._id,
    email: user.email,
    accountType: role || user.accountType || "student",
    role: role || user.accountType || "student",
  };
};

export const buildFrontendUserPayload = (role, user) => {
  if (role === "tutor") {
    return {
      _id: user._id,
      firstName: user.fName,
      lastName: user.lName,
      email: user.email,
      accountType: "tutor",
      role: "tutor",
      image: user.profilePic,
      isVerified: user.isVerified || true,
      provider: user.provider,
    };
  }
  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    accountType: user.accountType || role,
    role: user.accountType || role,
    image: user.image,
    isVerified: user.isVerified || true,
    provider: user.provider,
  };
};
