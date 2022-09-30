import joi from "joi";

export const postGamesSchema = joi.object({
  name: joi.string().required(),
  image: joi.string().required(),
  stockTotal: joi.number().integer().greater(0),
  categoryId: joi.number().integer(),
  pricePerDay: joi.number().integer().greater(0),
});

export const clientSchema = joi.object({
  name: joi.string().required(),
  phone: joi.string().min(10).max(11).required(),
  cpf: joi.string().min(11).max(11).required(),
  birthday: joi.date().required(),
});
