export const validateCreateTreatment = (payload: any) => {
  const errors: string[] = [];

  if (!payload) errors.push('Payload is required');

  if (
    !payload.name ||
    typeof payload.name !== 'string' ||
    !payload.name.trim()
  ) {
    errors.push("Valid 'name' is required");
  }

  if (payload.price === undefined || isNaN(Number(payload.price))) {
    errors.push("Valid 'price' is required");
  }

  if (!payload.categoryId || typeof payload.categoryId !== 'string') {
    errors.push("Valid 'categoryId' is required");
  }

  return errors;
};

export const validateUpdatePrice = (payload: any) => {
  const errors: string[] = [];

  if (payload.price === undefined || isNaN(Number(payload.price))) {
    errors.push("Valid 'price' is required");
  }

  return errors;
};
