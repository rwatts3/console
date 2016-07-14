export function validateModelName (modelName: string): boolean {
  // model name should start with a capital letter and only contain letters
  return /^[A-Z]/.test(modelName) && /^[a-zA-Z]+$/.test(modelName)
}

export function validateProjectName (projectName: string): boolean {
  // project name should start with a capital letter and only contains alphanumberic characters and space
  return /^[A-Z]/.test(projectName) && /^[a-zA-Z0-9 ]+$/.test(projectName)
}
