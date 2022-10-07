const express = require("express");
const router = express.Router();
const httpStatus = require("lib/httpStatus");
const verifyToken = require("lib/verifyToken");
const TMTask = require("models/TMTask");
const TMTaskNote = require("models/TMTaskNote");
const TMUserAssignees = require("models/TMUserAssignees");
const TMUserTasks = require("models/TMUserTasks");
const User = require("models/User");
const { userSelection, taskSelection } = require("selections/selections");

router.get("/assignees", verifyToken, function (req, res) {
  TMUserAssignees.findOne(
    { user: req.userId },
    function (error, userAssignees) {
      if (error) {
        const message = `Server error: ${error.message}`;
        return res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: message });
      }
      let assignees = null;
      if (userAssignees) assignees = userAssignees.assignees;
      return res.status(httpStatus.OK).send(assignees);
    }
  ).populate("assignees", userSelection);
});

router.post("/assignees", verifyToken, function (req, res) {
  const email = req.body.email;
  if (!email) {
    const message = "Field not supplied: email";
    return res.status(httpStatus.BAD_REQUEST).send({ error: message });
  }
  User.findOne({ email: email }, function (error, assignee) {
    if (error) {
      const message = `Server error: ${error.message}`;
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: message });
    }
    if (!assignee) {
      const message = "Assignee not found";
      return res.status(httpStatus.BAD_REQUEST).send({ error: message });
    }
    if (!assignee.verified) {
      const message = "Assignee found, but has not verified email";
      return res.status(httpStatus.BAD_REQUEST).send({ error: message });
    }
    TMUserAssignees.findOne(
      { user: req.userId },
      function (error, userAssignees) {
        if (error) {
          const message = `Server error: ${error.message}`;
          return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .send({ error: message });
        }
        if (userAssignees) {
          if (userAssignees.assignees.includes(assignee._id)) {
            const message = "Assignee already exists";
            return res.status(httpStatus.BAD_REQUEST).send({ error: message });
          }
          userAssignees.assignees.push(assignee._id);
          userAssignees.save(function (error, savedUserAssignees) {
            if (error) {
              const message = `Server error: ${error.message}`;
              return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .send({ error: message });
            }
            return res.status(httpStatus.CREATED).send();
          });
        } else {
          TMUserAssignees.create({
            user: req.userId,
            assignees: [assignee._id],
          })
            .then((newUserAssignees) => {
              return res.status(httpStatus.CREATED).send();
            })
            .catch((error) => {
              const message = `Server error: ${error.message}`;
              return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .send({ error: message });
            });
        }
      }
    );
  });
});

router.get("/tasks/:assigneeId", verifyToken, function (req, res) {
  const assigneeId = req.params.assigneeId;
  if (!assigneeId) {
    const message = "Field not supplied: assigneeId";
    return res.status(httpStatus.BAD_REQUEST).send({ error: message });
  }
  TMUserTasks.findOne({ user: assigneeId }, function (error, userTasks) {
    if (error) {
      const message = `Server error: ${error.message}`;
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: message });
    }
    let tasks = null;
    if (userTasks) tasks = userTasks.tasks;
    return res.status(httpStatus.OK).send(tasks);
  }).populate("tasks", taskSelection);
});

router.post("/tasks", verifyToken, function (req, res) {
  const {
    assignedTo,
    name,
    description,
    assignedDate,
    status,
    startedDate,
    completedDate,
  } = req.body;
  if (!assignedTo || !name || !status) {
    let message = "Field(s) not supplied: ";
    if (!assignedTo) message += "assignedTo ";
    if (!name) message += "name ";
    if (!status) message += "status";
    return res.status(httpStatus.BAD_REQUEST).send({ error: message });
  }

  TMTask.create(
    {
      owner: req.userId,
      assignedTo: assignedTo,
      name: name,
      description: description,
      status: status,
      assignedDate: assignedDate,
      startedDate: startedDate,
      completedDate: completedDate,
    },
    function (error, task) {
      if (error) {
        const message = `Server error: ${error.message}`;
        return res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: message });
      }
      TMUserTasks.findOne({ user: assignedTo }, function (error, userTasks) {
        if (error) {
          const message = `Server error: ${error.message}`;
          return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .send({ error: message });
        }
        if (userTasks) {
          userTasks.tasks.push(task._id);
          userTasks.save();
          res.status(httpStatus.CREATED).send();
        } else {
          TMUserTasks.create({
            user: assignedTo,
            tasks: [task._id],
          })
            .then((newUserTasks) => {
              res.status(httpStatus.CREATED).send();
            })
            .catch((error) => {
              const message = `Server error: ${error.message}`;
              return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .send({ error: message });
            });
        }
      });
    }
  );
});

router.put("/tasks", verifyToken, function (req, res) {
  const {
    taskId,
    assignedTo,
    name,
    description,
    status,
    assignedDate,
    startedDate,
    completedDate,
  } = req.body;
  if (!taskId || !assignedTo || !name || !status) {
    let message = "Field(s) not supplied: ";
    if (!taskId) message += "taskId ";
    if (!assignedTo) message += "assignedTo ";
    if (!name) message += "name ";
    if (!status) message += "status ";
    return res.status(httpStatus.BAD_REQUEST).send({ error: message });
  }
  TMTask.findByIdAndUpdate(
    taskId,
    {
      ownerId: req.userId,
      assignedTo: assignedTo,
      name: name,
      description: description,
      status: status,
      assignedDate: assignedDate,
      startedDate: startedDate,
      completedDate: completedDate,
    },
    function (err, task) {
      if (err) {
        const message = `Server error: ${err.message}`;
        return res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: message });
      }
      res.status(httpStatus.OK).send(task);
    }
  );
});

router.get("/tasknotes/:taskId", verifyToken, function (req, res) {
  const taskId = req.params.taskId;
  if (!taskId) {
    const message = "Field not supplied: taskId";
    return res.status(httpStatus.BAD_REQUEST).send({ error: message });
  }
  TMTaskNote.find({ task: taskId }, function (error, taskNotes) {
    if (error) {
      const message = `Server error: ${error.message}`;
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: message });
    }
    return res.status(httpStatus.OK).send(taskNotes);
  }).populate("owner");
});

router.post("/tasknotes", verifyToken, function (req, res) {
  const { taskId, note } = req.body;
  if (!taskId || !note) {
    let message = "Field(s) not supplied: ";
    if (!taskId) message += "taskId ";
    if (!note) message += "note";
    return res.status(httpStatus.BAD_REQUEST).send({ error: message });
  }
  TMTask.findById(taskId, function (error, task) {
    if (error) {
      const message = `Server error: ${error.message}`;
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: message });
    }
    TMTaskNote.create(
      {
        task: taskId,
        owner: req.userId,
        note: note,
      },
      function (error, taskNote) {
        if (error) {
          const message = `Server error: ${error.message}`;
          return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .send({ error: message });
        }
        task.notes.push(taskNote._id);
        task.save();
        res.status(httpStatus.CREATED).send();
      }
    );
  });
});

router.put("/tasknotes", verifyToken, function (req, res) {
  const { taskNoteId, note } = req.body;
  if (!taskNoteId || !note) {
    let message = "Field(s) not supplied: ";
    if (!taskNoteId) message += "taskNoteId ";
    if (!note) message += "note";
    return res.status(httpStatus.BAD_REQUEST).send({ error: message });
  }
  TMTaskNote.findByIdAndUpdate(
    taskNoteId,
    {
      note: note,
    },
    function (error, taskNote) {
      if (error) {
        const message = `Server error: ${error.message}`;
        return res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .send({ error: message });
      }
      res.status(httpStatus.OK).send(taskNote);
    }
  );
});

module.exports = router;
