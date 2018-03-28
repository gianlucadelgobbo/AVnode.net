// SUCCESS
{RETURNED_RES}

// ERRORS 404
{
  errors: {
    content:['404']
  },
  res: null
}

// ERRORS 500
{
  errors: {
    content:['DOC_NOT_FOUND']
  },
  res: null
}

{
  errors:{
    FIELDNAME_1:['CODE_HR'],  // Errors on fields
    FIELDNAME_2:['CODE_HR'] // Errors on fields
  },
  res: RETURNED_RES // Probably null
}