export const validarSchemas = (schema) => (req, res, next) => {
  const resultado = schema.safeParse(req.body);

  if (!resultado.success) {
    return res.status(400).json({
      mensaje: resultado.error.issues[0].message
    });
  }

  req.body = resultado.data;
  next();
};