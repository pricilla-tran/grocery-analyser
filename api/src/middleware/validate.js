const validate = (schema) => (req, res, next) => {
  try {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      const errors = result.error.issues.map(issue => ({
        field: issue.path.join('.') || 'root',
        message: issue.message
      }))
      return res.status(400).json({ errors })
    }

    req.body = result.data
    next()
  } catch (err) {
    next(err)
  }
}

module.exports = validate