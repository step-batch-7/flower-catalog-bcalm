const {env} = process;

module.exports = {
  COMMENT_PATH: env.COMMENTS_STORE_PATH || 'dataBase/commentList.json'
};
