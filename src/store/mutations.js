/**
 * 更改状态  同步操作
 */
import * as types from './mutation-types';

const mutations = {
    // state 获取当前状态设置的state  其他=参数
    // 主页 选择的的歌曲列表
    [types.SET_HOME_SONG_LIST](state, homeSonglist) {
        state.homeSonglist = homeSonglist;
    },
    // 设置遮罩层显示隐藏
    [types.SET_MASKLAYER](state, maskLayer) {
        state.maskLayer = maskLayer;
    },
    // 歌曲列表接口一次请求的页数 一次 +15
    [types.SET_SONG_BEGIN](state, songBegin) {
        state.songBegin = songBegin;
    }
};

export default mutations;
