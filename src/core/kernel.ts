import * as setup from '../setup';

export const init = async () => {
  try {
    await preBootMaster();
    await bootMater();
    await postBootMaster();
  }
  catch (err) {
    throw err;
  }
}

export const bootMater = async () => {
  await setup.init();
}

export const preBootMaster = async () => {

}

export const postBootMaster = async () => {

}