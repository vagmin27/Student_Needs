import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

function MyMongoDB() {
  const myDB = {};
  const url = process.env.MONGO_URI || "mongodb://localhost:27017";
  const DB_NAME = "TutorsApp";
  const USER_COLLECTION = "users";
  const TUTORS_COLLECTION = "tutors";
  const PAGE_SIZE = 18;

  // ✅ Safe close
  const closeClient = async (client) => {
    if (client) await client.close();
  };

  /**
   * 🔐 CREATE USER
   */
  myDB.createUser = async (_user, _hash, displayName = {}) => {
    let client;
    try {
      client = new MongoClient(url);
      const db = client.db(DB_NAME);
      const usersCol = db.collection(USER_COLLECTION);

      const res = await usersCol.insertOne({
        user: _user,
        password: _hash,
        profile: displayName,
        pic: null,
        schedule: [],
        history: [],
      });

      return res;
    } catch (err) {
      throw new Error(err.message);
    } finally {
      await closeClient(client);
    }
  };

  /**
   * 🔍 GET USER BY EMAIL (FOR LOGIN)
   */
  myDB.getUsers = async (_email) => {
    let client;
    try {
      client = new MongoClient(url);
      const db = client.db(DB_NAME);
      const usersCol = db.collection(USER_COLLECTION);

      return await usersCol.findOne(
        { user: _email },
        {
          projection: {
            user: 1,
            password: 1,
            profile: 1,
          },
        },
      );
    } catch (err) {
      throw new Error(err.message);
    } finally {
      await closeClient(client);
    }
  };

  /**
   * 🔥 GET USER BY ID (VERY IMPORTANT FOR PASSPORT)
   */
  myDB.getUsersById = async (id) => {
    let client;
    try {
      client = new MongoClient(url);
      const db = client.db(DB_NAME);
      const usersCol = db.collection(USER_COLLECTION);

      console.log("🔍 Fetching user by ID:", id);

      const user = await usersCol.findOne({
        _id: new ObjectId(id),
      });

      console.log("👤 User found:", user);

      return user || null;
    } catch (err) {
      console.error("❌ getUsersById error:", err);
      return null;
    } finally {
      await closeClient(client);
    }
  };

  /**
   * 🔍 FIND TUTORS (SEARCH + PAGINATION)
   */
  myDB.findTutors = async (keyword, page = 0) => {
    let client;

    try {
      // ✅ safety check
      if (!keyword || keyword.trim() === "") {
        return [[], 0];
      }

      client = new MongoClient(url);
      const db = client.db(DB_NAME);
      const usersCol = db.collection(USER_COLLECTION);

      const limit = PAGE_SIZE;
      const skip = Number(page) * limit;

      // 🔍 search tutors by subject
      const tutors = await usersCol
        .find({
          "profile.subjects": {
            $regex: keyword,
            $options: "i",
          },
        })
        .skip(skip)
        .limit(limit)
        .toArray();

      // 🔢 count total results
      const count = await usersCol.countDocuments({
        "profile.subjects": {
          $regex: keyword,
          $options: "i",
        },
      });

      return [tutors || [], count || 0];
    } catch (err) {
      console.error("❌ findTutors ERROR:", err);
      return [[], 0]; // ✅ prevent crash
    } finally {
      await closeClient(client);
    }
  };

  /**
   * 📝 UPDATE PROFILE
   */
  myDB.updatesProfile = async (id, updatedProfile) => {
    let client;
    try {
      client = new MongoClient(url);
      const db = client.db(DB_NAME);
      const usersCol = db.collection(USER_COLLECTION);

      return await usersCol.updateOne(
        { _id: new ObjectId(id) },
        { $set: { profile: updatedProfile } },
      );
    } catch (err) {
      throw new Error(err.message);
    } finally {
      await closeClient(client);
    }
  };

  /**
   * 🖼️ UPDATE PROFILE PIC
   */
  myDB.updatesPic = async (id, picPath) => {
    let client;
    try {
      client = new MongoClient(url);
      const db = client.db(DB_NAME);
      const usersCol = db.collection(USER_COLLECTION);

      return await usersCol.updateOne(
        { _id: new ObjectId(id) },
        { $set: { pic: picPath } },
      );
    } catch (err) {
      throw new Error(err.message);
    } finally {
      await closeClient(client);
    }
  };

  /**
   * ❌ DELETE USER
   */
  myDB.deleteUser = async (id) => {
    let client;
    try {
      client = new MongoClient(url);
      const db = client.db(DB_NAME);
      const usersCol = db.collection(USER_COLLECTION);

      return await usersCol.deleteOne({ _id: new ObjectId(id) });
    } catch (err) {
      throw new Error(err.message);
    } finally {
      await closeClient(client);
    }
  };

  /**
   * 📅 GET USER SCHEDULE
   */
  myDB.getUserSchedule = async (_user) => {
    let client;
    try {
      if (!_user) return { schedule: [] };

      client = new MongoClient(url);
      const userCol = client.db(DB_NAME).collection(USER_COLLECTION);

      const userId = typeof _user === "string" ? new ObjectId(_user) : _user;

      const userData = await userCol.findOne(
        { _id: userId },
        { projection: { password: 0 } },
      );

      return { schedule: userData?.schedule || [] };
    } catch (err) {
      console.error("🔥 SCHEDULE ERROR:", err);
      return { schedule: [] };
    } finally {
      await closeClient(client);
    }
  };

  /**
   * 📌 BOOKING
   */
  myDB.makeBooking = async (_user, _booking) => {
    let client;
    try {
      client = new MongoClient(url);
      const userCol = client.db(DB_NAME).collection(USER_COLLECTION);

      return await userCol.updateOne(
        { _id: new ObjectId(_user) },
        { $push: { schedule: { $each: _booking } } },
      );
    } finally {
      await closeClient(client);
    }
  };

  /**
   * ⭐ ADD REVIEW
   */
  myDB.addReview = async (tutor, tutor_lastname, review) => {
    let client;
    try {
      client = new MongoClient(url);
      const db = client.db(DB_NAME);
      const reviewsCol = db.collection("reviews");

      return await reviewsCol.insertOne({
        tutor,
        tutor_lastname,
        review,
        createdAt: new Date(),
      });
    } catch (err) {
      throw new Error(err.message);
    } finally {
      await closeClient(client);
    }
  };

  /**
   * ⭐ GET REVIEWS BY TUTOR
   */
  myDB.getReviewsByTutor = async (tutorId) => {
    let client;
    try {
      client = new MongoClient(url);
      const db = client.db(DB_NAME);
      const reviewsCol = db.collection("reviews");

      const reviews = await reviewsCol.find({ tutor: tutorId }).toArray();

      return reviews || [];
    } catch (err) {
      console.error("❌ getReviewsByTutor ERROR:", err);
      return [];
    } finally {
      await closeClient(client);
    }
  };

  /**
   * ❌ DELETE REVIEW
   */
  myDB.deleteReview = async (reviewId) => {
    let client;
    try {
      client = new MongoClient(url);
      const db = client.db(DB_NAME);
      const reviewsCol = db.collection("reviews");

      return await reviewsCol.deleteOne({
        _id: new ObjectId(reviewId),
      });
    } catch (err) {
      throw new Error(err.message);
    } finally {
      await closeClient(client);
    }
  };

  return myDB;
}

export default MyMongoDB();