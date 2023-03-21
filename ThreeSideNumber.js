const getFaceMatrix = (object, Matrix3) => {
    let normalMatrix = Matrix3.getNormalMatrix(object.object.matrixWorld);
    return object.face.normal.clone().applyMatrix3(normalMatrix).normalize();
}

export default (object, Matrix3) => {
    let faceMatrix = getFaceMatrix(object, Matrix3),
        faceMatrixZ = Math.abs(faceMatrix.z),
        faceMatrixX = Math.abs(faceMatrix.x),
        faceMatrixY = Math.abs(faceMatrix.y),
        sideNumber;

    if (faceMatrixZ > faceMatrixX && faceMatrixZ > faceMatrixY) {
        sideNumber = faceMatrix.z > 0 ? 1 : 3;
    } else if (faceMatrixX > faceMatrixZ && faceMatrixX > faceMatrixY) {
        sideNumber = faceMatrix.x > 0 ? 2 : 4;
    } else if (faceMatrixY > faceMatrixZ && faceMatrixY > faceMatrixX) {
        sideNumber = faceMatrix.y > 0 ? 5 : 6;
    }

    return sideNumber;
}