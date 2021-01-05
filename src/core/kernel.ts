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
  // write the code here which need to execute first 
}

export const postBootMaster = async () => {
  // Write the code here which need to be executed after after kernel
}