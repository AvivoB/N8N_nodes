module.exports = {
  extends: ['@n8n/eslint-config/node'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    'import/order': 'off',
    'n8n-nodes-base/node-filename-against-convention': 'error',
    'n8n-nodes-base/node-class-description-inputs-wrong-regular-node': 'error',
    'n8n-nodes-base/node-class-description-outputs-wrong': 'error',
    'n8n-nodes-base/node-execute-block-double-assertion-for-items': 'error'
  }
};
