import apis from '@apis/index';
import { createAsyncThunk } from '@reduxjs/toolkit';

const authThunk = {
  getProfile: createAsyncThunk('user/getProfile', async () => {
    const res = await apis.userApi.getProfile();
    return res.data;
  }),
};

export default authThunk;
