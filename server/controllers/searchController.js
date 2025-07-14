const mongoose = require('mongoose');
const assignmentModel = require('../models/assignmentModel');

exports.globalSearch = async (req, res) => {
  const searchTerm = req.query.q;
  if (!searchTerm)
    return res.status(400).json({ error: 'Missing search term' });

  const userId = new mongoose.Types.ObjectId(req.user._id);

  try {
    const pipeline = [
      {
        $search: {
          index: 'assignment-index',
          compound: {
            must: [
              {
                text: {
                  query: searchTerm,
                  path: ['assignments.title', 'assignments.description']
                }
              }
            ],
            filter: [
              {
                equals: {
                  path: 'creator_id',
                  value: userId
                }
              }
            ]
          }
        }
      },
      { $unwind: '$assignments' },
      {
        $match: {
          $or: [
            { 'assignments.title': { $regex: searchTerm, $options: 'i' } },
            { 'assignments.description': { $regex: searchTerm, $options: 'i' } }
          ]
        }
      },
      {
        $project: {
          _id: 1,
          creator_id: 1,
          title: '$assignments.title',
          description: '$assignments.description',
          due_date: '$assignments.due_date',
          creation_date: '$assignments.creation_date',
          status: '$assignments.status',
          _type: { $literal: 'assignment' },
          score: { $meta: 'searchScore' }
        }
      },
      {
        $unionWith: {
          coll: 'challenges',
          pipeline: [
            {
              $search: {
                index: 'challenges-index',
                compound: {
                  must: [
                    {
                      text: {
                        query: searchTerm,
                        path: ['title', 'description']
                      }
                    }
                  ],
                  filter: [
                    {
                      equals: {
                        path: 'creator_id',
                        value: userId
                      }
                    }
                  ]
                }
              }
            },
            {
              $project: {
                _id: 1,
                title: 1,
                description: 1,
                _type: { $literal: 'challenge' },
                score: { $meta: 'searchScore' }
              }
            }
          ]
        }
      },
      {
        $unionWith: {
          coll: 'users',
          pipeline: [
            {
              $search: {
                index: 'user-index',
                compound: {
                  should: [
                    {
                      autocomplete: {
                        query: searchTerm,
                        path: 'name'
                      }
                    },
                    {
                      autocomplete: {
                        query: searchTerm,
                        path: 'email'
                      }
                    },
                    {
                      autocomplete: {
                        query: searchTerm,
                        path: 'reg_no'
                      }
                    }
                  ]
                }
              }
            },
            {
              $project: {
                _id: 1,
                name: 1,
                email: 1,
                reg_no: 1,
                _type: { $literal: 'user' },
                score: { $meta: 'searchScore' }
              }
            }
          ]
        }
      },
      { $sort: { score: -1 } },
      { $limit: 10 }
    ];

    const results = await assignmentModel.aggregate(pipeline);

    res.status(200).json({ results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
