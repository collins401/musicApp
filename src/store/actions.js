/** 异步更改 **/
import * as types from './mutation-types';
// 歌曲播放状态方法
import {isPlayMode} from 'common/js/config';
// 设置随机歌曲列表方法
import {shuffle} from 'common/js/util';
// 收藏歌曲方法 saveFavorite
// 取消收藏歌曲方法 deleteFavorite
// 保存播放列表 savePlayList
// 获取当前播放索引 saveCurrentIndex
// 保存顺序播放列表 saveSequenceList
// 保存当前播放歌曲链接 savePlayUrl
import {saveFavorite, deleteFavorite, savePlayList, saveCurrentIndex, saveSequenceList , savePlayUrl} from 'common/js/cache';

// 找到随机列表中,对应点击选择列表的歌曲的索引
function findIndex (list, song) {
    return list.findIndex((item) => {
        return item.id === song.id;
    });
}

/**
 * 设置是否显示搜索框
 * @type {Array}
 */
export const showSearch = function ({commit}, showSearch) {
    commit(types.SET_SHOW_SEARCH, showSearch);
};

/** *************** 播放组件状态 ***************** **/
/**
 * 选择播放
 * @type {Object}
 * list {Array}
 * index {Number}
 * SET_PLAYING_STATE {Boolean}
 */
export const selectPlay = function ({commit, state}, {list, index}) {
    // 顺序播放列表
    commit(types.SET_SEQUENCE_LIST, saveSequenceList(list));
    // 判断是否是点击了音乐列表随机播放按钮，在随机列表中找到对应的歌曲进行顺序播放
    if (state.playMode === isPlayMode.random) {
        // 获取随机的播放列表
        let randomList = shuffle(list);
        // 替换掉当前的播放列表
        commit(types.SET_PLAYLIST, savePlayList(randomList));
        // 获取随机列表中对应播放列表的歌曲
        index = findIndex(randomList, list[index]);
    }
    else {
        // 设置当前的播放列表
        commit(types.SET_PLAYLIST, savePlayList(list));
    }

    // 当前播放索引
    commit(types.SET_CURRENT_INDEX, saveCurrentIndex(index));
    // 控制播放
    commit(types.SET_PLAYING_STATE, true);
};

/**
 * 删除歌曲
 * @type {String}
 */
export const deleteSong = function ({commit, state}, currentSong) {
    // 获取播放列表
    let playlist = state.playList.slice();
    // 获取顺序播放列表
    let sequenceList = state.sequenceList.slice();
    // 获取当前歌曲的index索引
    let currentIndex = state.currentIndex;

    // 找到列表中,对应点击的歌曲的索引
    // 找到列表中,对应点击的歌曲的索引
    let pIndex = findIndex(playlist, currentSong);
    // 删除对应索引的歌曲
    playlist.splice(pIndex, 1);

    // 找到顺序播放列表中,对应点击的歌曲的索引
    let sIndex = findIndex(sequenceList, currentSong);
    // 删除对应索引的歌曲
    sequenceList.splice(sIndex, 1);

    // 如果当前播放列表中没有歌曲 重新设置当前歌曲索引为0
    if (currentIndex > pIndex || currentIndex === playlist.length) {
        currentIndex--;
    }

    commit(types.SET_PLAYLIST, savePlayList(playlist));
    commit(types.SET_SEQUENCE_LIST, saveSequenceList(sequenceList));
    commit(types.SET_CURRENT_INDEX, saveCurrentIndex(currentIndex));

    // 如果当前列表中没有歌曲了就设置播放器停止播放
    if (!playlist.length) {
        commit(types.SET_PLAYING_STATE, false);
    }
    else {
        commit(types.SET_PLAYING_STATE, true);
    }
};

/**
 * 删除所有歌曲
 * @type {Array}
 */
export const deleteSongList = function ({commit}) {
    // 初始化当前歌曲索引
    commit(types.SET_CURRENT_INDEX, saveCurrentIndex(-1));
    // 初始化播放列表
    commit(types.SET_PLAYLIST, savePlayList([]));
    // 初始化顺序播放列表
    commit(types.SET_SEQUENCE_LIST, saveSequenceList([]));
    // 初始化播放器播放状态
    commit(types.SET_PLAYING_STATE, false);
    savePlayUrl(null);
};

/**
 * 播放全部
 * @type {Object}
 * list {Array}
 * index {Number}
 * SET_PLAYING_STATE {Boolean}
 */
export const allPlay = function ({commit}, {list}) {
    // 切换到顺序播放模式
    commit(types.SET_PLAY_MODE, isPlayMode.sequence);
    // 获取顺序播放列表
    commit(types.SET_SEQUENCE_LIST, saveSequenceList(list));
    // 设置当前的播放列表
    commit(types.SET_PLAYLIST, savePlayList(list));
    // 设置当前的播放位置
    commit(types.SET_CURRENT_INDEX, saveCurrentIndex(0));
    // 控制播发器放大缩小
    commit(types.SET_FULL_SCREEN, false);
    // 控制播放
    commit(types.SET_PLAYING_STATE, true);
};

/*
 * 设置歌曲播放列表
 * @type {Boolean}
 * */
export const playList = function ({commit}, playList) {
    commit(types.SET_PLAYLIST, savePlayList(playList));
};
/*
 * 控制歌曲播放模式
 * @type {Boolean}
 * */
export const playMode = function ({commit}, playMode) {
    commit(types.SET_PLAY_MODE, playMode);
};

/**
 * 控制歌曲播放
 * @type {Boolean}
 */
export const playing = function ({commit}, flag) {
    commit(types.SET_PLAYING_STATE, flag);
};

/**
 * 歌曲列表
 * @type {Array}
 */
export const songList = function ({commit}, SET_SONG_LIST) {
    commit(types.SET_SONG_LIST, SET_SONG_LIST);
};

/*
 * 设置当前播放歌曲索引
 * @type {Boolean}
 * */
export const currentIndex = function ({commit}, currentIndex) {
    commit(types.SET_CURRENT_INDEX, saveCurrentIndex(currentIndex));
};

/*
 * 控制播发器放大缩小
 * @type {Boolean}
 * */
export const fullScreen = function ({commit}, fullScreen) {
    commit(types.SET_FULL_SCREEN, fullScreen);
};

/**
 * 设置收藏歌曲
 * @type {Array}
 */
export const saveFavoriteList = function ({commit}, currentSong) {
    commit(types.SET_FAVORITE_LIST, saveFavorite(currentSong));
};

/**
 * 取消收藏歌曲
 * @type {Array}
 */
export const deleteFavoriteList = function ({commit}, currentSong) {
    commit(types.SET_FAVORITE_LIST, deleteFavorite(currentSong));
};
/********************************************/

/** *****************滚动组件的状态*********************** **/
/**
 * 滚动的状态
 * 当 probeType 为 1 的时候，会非实时（屏幕滑动超过一定时间后）派发scroll 事件；
 * 当 probeType 为 2 的时候，会在屏幕滑动的过程中实时的派发 scroll 事件；
 * 当 probeType 为 3 的时候，不仅在屏幕滑动的过程中，而且在 momentum 滚动动画运行过程中实时派发 scroll 事件。
 * @type {Number}
 */
export const probeType = function ({commit}, probeType) {
    commit(types.SET_PROBETYPE, probeType);
};

/**
 * 分发点击事件
 * @type {Boolean}
 */
export const click = function ({commit}, click) {
    commit(types.SET_CLICK, click);
};

/**
 * 滚动组件外部传入的数据
 * @type {Array}
 */
export const scrollData = function ({commit}, scrollData) {
    commit(types.SET_SCROLL_DATA, scrollData);
};

/**
 * scroll 要不要监听滚动事件
 * @type {Boolean}
 */
export const listenScroll = function ({commit}, listenScroll) {
    commit(types.SET_LISTEN_SCROLL, listenScroll);
};

/**
 * 是否开启滚动到到底部刷新
 * @type {Boolean}
 */
export const pullup = function ({commit}, pullup) {
    commit(types.SET_PULLUP, pullup);
};

/**
 * 设置是否开启上拉加载
 * @type {Boolean}
 */
export const pullUpLoad = function ({commit}, pullUpLoad) {
    commit(types.SET_PULLUP_LOAD, pullUpLoad);
};

/**
 * 开始滚动
 * @type {Boolean}
 */
export const beforeScroll = function ({commit}, beforeScroll) {
    commit(types.SET_BEFORE_SCROLL, beforeScroll);
};

/**
 * 刷新延迟
 * @type {Number}
 */
export const refreshDelay = function ({commit}, refreshDelay) {
    commit(types.SET_REFRESH_DELAY, refreshDelay);
};

/**
 * 是否开启回弹效果
 * @type {Boolean}
 */
export const bounce = function ({commit}, bounce) {
    commit(types.SET_BOUNCE, bounce);
};

/**
 * 回弹时间
 * @type {Boolean}
 */
export const bounceTime = function ({commit}, bounceTime) {
    commit(types.SET_BOUNCE_TIME, bounceTime);
};
/********************************************/
