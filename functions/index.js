const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.updateUserPassword = functions.https.onCall((data, context) => {
  // 요청에서 UID와 새 비밀번호 추출
  const uid = data.uid;
  const newPassword = data.newPassword;

  // 관리자 권한으로 비밀번호 변경
  return admin
    .auth()
    .updateUser(uid, {
      password: newPassword,
    })
    .then(() => {
      return {
        status: "success",
        message: "비밀번호가 성공적으로 업데이트되었습니다.",
      };
    })
    .catch((error) => {
      console.log(error);
      return { status: "error", message: "비밀번호 업데이트 중 오류 발생" };
    });
});
