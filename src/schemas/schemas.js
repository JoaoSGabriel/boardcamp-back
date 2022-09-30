import joi from "joi";

export const postGamesSchema = joi.object({
  name: joi.string().required(),
  image: joi.string().required(),
  stockTotal: joi.number().integer().greater(0),
  categoryId: joi.number().integer(),
  pricePerDay: joi.number().integer().greater(0),
});
