import Joi from "joi";

export const validateRegister = (data) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('SuperAdmin', 'Admin', 'Client').required(),
  });
  return schema.validate(data);
};

export const validateLogin = (data) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

export const validateEmail = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });
  return schema.validate(data);
};



export const validateProject = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string(),
    status: Joi.string().valid('Planned', 'In Progress', 'Completed'),
    project_manager_id: Joi.number().required(),
    client_id: Joi.number().required(),
  });
  return schema.validate(data);
};
