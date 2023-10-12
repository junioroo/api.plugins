export const validatePlugin = (data: any) => {
  if (!('name' in data)) {
    throw new Error('Name is required');
  }

  if (!('description' in data)) {
    throw new Error('Description is required');
  }

  if (!('contract' in data)) {
    throw new Error('Contract is required');
  }

  if (!('metadata' in data)) {
    throw new Error('Metadata is required');
  }
}
