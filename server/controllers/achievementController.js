const achievementModel = require("../models/achievementModel");

const MAX_ACHIEVEMENTS = 50;
const PAGE_LIMIT = 10;

const addAchievement = async (userId, challengeId, description, auraPoints) => {
  if (!userId || !challengeId || auraPoints == null) {
    throw new Error("Missing required fields: userId, challengeId, auraPoints");
  }

  let userAchievements = await achievementModel.findOne({ user: userId });

  // Create new document if not exists
  if (!userAchievements) {
    userAchievements = new achievementModel({
      user: userId,
      achievements: [],
    });
  }

  // Add new achievement at the beginning
  userAchievements.achievements.unshift({
    challenge_id: challengeId,
    description,
    aura_points: auraPoints,
    completionDate: new Date()
  });

  // Enforce Max Cap
  if (userAchievements.achievements.length > MAX_ACHIEVEMENTS) {
    userAchievements.achievements = userAchievements.achievements.slice(0, MAX_ACHIEVEMENTS);
  }

  await userAchievements.save();
};

// Get all achievements API
// getAchievements = async (req, res) => {
//   try {
//     const achievements = await achievementModel.findOne({ user: req.user._id }).select('achievements');

//     // console.log(user.req._id);

//     if (!achievements) {
//       return res.status(200).json({ message: 'No achievemenets yet.' });
//     }

//     res.status(200).json({ achievements: achievements });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };



const getAchievements = async (req, res) => {
  try {
    const page = parseInt(req.query.page || "1");
    const toSkip = (page - 1) * PAGE_LIMIT;

    const userAchievements = await achievementModel
      .findOne({ user: req.user._id })
      .populate('achievements.challenge_id', 'title') // populate challenge title if needed
      .lean();

    if (!userAchievements || !userAchievements.achievements.length) {
      return res.status(200).json({
        achievements: [],
        page: 1,
        pages: 1,
        total: 0,
      });
    }

    const total = userAchievements.achievements.length;
    const pages = Math.ceil(total / PAGE_LIMIT);

    // Ensure sorted by latest completion date
    const paginated = userAchievements.achievements
      .sort((a, b) => new Date(b.completionDate) - new Date(a.completionDate))
      .slice(toSkip, toSkip + PAGE_LIMIT);

    res.status(200).json({
      achievements: paginated,
      page,
      pages,
      total,
    });
  } catch (error) {
    console.error("Error fetching achievements:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAchievements };