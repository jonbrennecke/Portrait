// @flow
import React from 'react';
import {
  Animated,
  SafeAreaView,
  TouchableWithoutFeedback,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import { VideoComposition } from '@jonbrennecke/react-native-camera';
import noop from 'lodash/noop';
import ReactNativeHaptic from 'react-native-haptic';

import {
  Toast,
  PlaybackToolbar,
  BlurredSelectableButton,
  DepthInput,
  SelectableButton,
  SwipeDownGestureHandler,
} from '../../components';
import { ExportIcon } from '../../components/icons';
import { VideoReviewScreenToolbar } from './VideoReviewScreenToolbar';
import { VideoReviewScreenNavbar } from './VideoReviewScreenNavbar';
import { VideoReviewScreenFlatList } from './VideoReviewScreenFlatList';
import { VideoReviewScreenPlaybackToolbar } from './VideoReviewScreenPlaybackToolbar';
import { MediaExplorerModal } from '../mediaExplorer';
import { Units, Colors, BlurApertureRange } from '../../constants';
import { wrapWithVideoReviewScreenState } from './videoReviewScreenState';
import { wrapWithVideoReviewScreenGestureState } from './videoReviewScreenGestureState';
import { VideoPlayButton } from './VideoPlayButton';

import type { ComponentType } from 'react';

import type { Style } from '../../types';

export type VideoReviewScreenProps = {
  style?: ?Style,
  componentId?: string,
  isReviewScreenVisible: boolean,
  onRequestDismiss: () => void,
};

const styles = {
  flex: {
    flex: 1,
  },
  toolbar: {
    paddingVertical: Units.small,
    paddingHorizontal: Units.small,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopStyle: 'solid',
    borderTopColor: Colors.borders.gray,
  },
  depthInput: {
    paddingHorizontal: Units.small * 2,
  },
  video: (isFullScreen: boolean) => ({
    flex: 1,
    borderRadius: isFullScreen ? 0 : Units.extraSmall,
    overflow: 'hidden',
  }),
  iconButton: {
    height: Units.large,
    width: Units.large,
  },
  playbackToolbar: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 100,
  },
  overCameraToolbar: (swipeGesture: Animated.Value) => ({
    position: 'absolute',
    bottom: Units.small,
    left: 0,
    right: 0,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: Units.small,
    paddingVertical: 2 * Units.extraSmall,
    opacity: swipeGesture.interpolate({
      inputRange: [-100, 0, 100],
      outputRange: [0, 1, 0],
      extrapolate: 'clamp',
    }),
  }),
  background: (swipeGesture: Animated.Value) => ({
    ...StyleSheet.absoluteFillObject,
    opacity: swipeGesture.interpolate({
      inputRange: [-600, 0, 600],
      outputRange: [0, 1, 0],
      extrapolate: 'clamp',
    }),
    backgroundColor: Colors.backgrounds.black,
  }),
  toolbarCentered: {
    paddingVertical: Units.small,
    paddingHorizontal: Units.small,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopStyle: 'solid',
    borderTopColor: Colors.borders.gray,
  },
  playButtonContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
};

const decorate = (component: ComponentType<*>) =>
  wrapWithVideoReviewScreenGestureState(
    wrapWithVideoReviewScreenState(component)
  );

// eslint-disable-next-line flowtype/generic-spacing
export const VideoReviewScreen: ComponentType<
  VideoReviewScreenProps
> = decorate(
  ({
    style,
    toast,
    assetsArray,
    flatListRef,
    videoCompositionRef,
    isExporting,
    play,
    pause,
    selectedAsset,
    seekToProgress,
    selectedAssetID,
    blurAperture,
    setBlurAperture,
    isReviewScreenVisible,
    isDepthPreviewEnabled,
    isFullScreenVideo,
    isSwipeGestureEnabled,
    toggleDepthPreview,
    toggleFullScreenVideo,
    exportProgress,
    exportComposition,
    swipeGesture,
    playbackState,
    playbackProgress,
    selectVideo,
    loadNextAssets,
    isMediaModalVisible,
    isSwipeGestureInProgress,
    showMediaModal,
    hideMediaModal,
    onRequestDismiss,
    onSwipeDownGestureStart,
    onSwipeDownGestureRelease,
    onSwipeDownGestureMove,
    setPlaybackProgressThrottled,
    setPlaybackState,
    scrollToAsset,
    hideToast,
    showFullScreenVideo,
    onScrollDidBegin,
    onScrollDidEnd,
  }) => (
    <>
      <Animated.View
        style={styles.background(swipeGesture)}
        pointerEvents="none"
      />
      <SafeAreaView style={styles.flex}>
        <View style={[styles.flex, style]}>
          <VideoReviewScreenNavbar
            swipeGesture={swipeGesture}
            assetCreationDate={selectedAsset?.creationDate}
            isVisible={!isFullScreenVideo}
            exportProgress={exportProgress}
            onRequestPushCameraScreen={onRequestDismiss}
            onRequestPushMediaExplorerScreen={showMediaModal}
          />
          <SwipeDownGestureHandler
            style={styles.flex}
            verticalThreshold={300}
            swipeGesture={swipeGesture}
            isDisabled={!isSwipeGestureEnabled}
            isSwipeGestureInProgress={isSwipeGestureInProgress}
            onSwipeDownGestureStart={onSwipeDownGestureStart}
            onSwipeDownGestureRelease={onSwipeDownGestureRelease}
            onSwipeDownGestureMove={onSwipeDownGestureMove}
            onVerticalThresholdReached={onRequestDismiss}
          >
            {isReviewScreenVisible ? (
              <VideoReviewScreenFlatList
                isScrollEnabled={!isSwipeGestureInProgress}
                flatListRef={flatListRef}
                style={styles.flex}
                assets={assetsArray}
                onScrollBegin={onScrollDidBegin}
                onScrollEnd={onScrollDidEnd}
                renderItem={asset => (
                  <>
                    <TouchableWithoutFeedback onPress={toggleFullScreenVideo}>
                      <View style={styles.flex}>
                        <VideoComposition
                          ref={
                            selectedAssetID === asset.assetID
                              ? videoCompositionRef
                              : noop
                          }
                          style={styles.video(isFullScreenVideo)}
                          assetID={asset.assetID}
                          previewMode={
                            isDepthPreviewEnabled ? 'depth' : 'portraitMode'
                          }
                          resizeMode="scaleAspectFill"
                          blurAperture={
                            selectedAssetID === asset.assetID
                              ? blurAperture
                              : BlurApertureRange.initialValue
                          }
                          isReadyToLoad={selectedAssetID === asset.assetID}
                          onPlaybackProgress={setPlaybackProgressThrottled}
                          onPlaybackStateChange={p =>
                            setPlaybackState(asset.assetID, p)
                          }
                          onMetadataLoaded={metadata => {
                            if (
                              metadata.blurAperture &&
                              selectedAssetID === asset.assetID
                            ) {
                              setBlurAperture(metadata.blurAperture);
                            }
                          }}
                        />
                      </View>
                    </TouchableWithoutFeedback>
                    <View
                      style={styles.playButtonContainer}
                      pointerEvents="box-none"
                    >
                      <VideoPlayButton
                        playbackState={playbackState(asset.assetID)}
                        onPress={() => {
                          if (playbackState(asset.assetID) !== 'playing') {
                            seekToProgress(0);
                            play();
                            showFullScreenVideo();
                          }
                        }}
                      />
                    </View>
                  </>
                )}
                onRequestDismiss={onRequestDismiss}
                onRequestLoadMore={loadNextAssets}
                onSelectAsset={asset => selectVideo(asset.assetID)}
                onSwipeDownGestureRelease={onSwipeDownGestureRelease}
                onSwipeDownGestureMove={onSwipeDownGestureMove}
              />
            ) : null}
            {!isFullScreenVideo ? (
              <Animated.View style={styles.overCameraToolbar(swipeGesture)}>
                <BlurredSelectableButton
                  text="Depth"
                  isSelected={isDepthPreviewEnabled}
                  onPress={toggleDepthPreview}
                />
              </Animated.View>
            ) : null}
          </SwipeDownGestureHandler>
          <VideoReviewScreenPlaybackToolbar isVisible={isFullScreenVideo}>
            <View style={styles.playbackToolbar}>
              <PlaybackToolbar
                playbackProgress={playbackProgress}
                playbackState={
                  selectedAssetID
                    ? playbackState(selectedAssetID) || 'waiting'
                    : 'waiting'
                }
                assetID={selectedAssetID}
                assetDuration={selectedAsset?.duration}
                onRequestPlay={play}
                onRequestPause={pause}
                onSeekToProgress={seekToProgress}
              />
            </View>
          </VideoReviewScreenPlaybackToolbar>
          <VideoReviewScreenToolbar
            swipeGesture={swipeGesture}
            isVisible={!isFullScreenVideo}
          >
            <View style={styles.toolbar}>
              <DepthInput
                style={styles.depthInput}
                value={blurAperture || BlurApertureRange.initialValue}
                min={BlurApertureRange.lowerBound}
                max={BlurApertureRange.upperBound}
                onSelectValue={setBlurAperture}
              />
            </View>
            <View style={styles.toolbarCentered}>
              <SelectableButton
                isDisabled={isExporting}
                text="Save"
                isSelected
                icon={isExporting ? ActivityIndicator : ExportIcon}
                onPress={exportComposition}
              />
            </View>
          </VideoReviewScreenToolbar>
        </View>
      </SafeAreaView>
      <Toast
        isVisible={toast.isVisible}
        title={toast.title}
        body={toast.body}
        buttons={toast.buttons}
        onRequestDismiss={() => {
          ReactNativeHaptic.generate('selection');
          hideToast();
        }}
      />
      <MediaExplorerModal
        isVisible={isMediaModalVisible}
        onRequestDismissModal={hideMediaModal}
        onSelectVideo={assetID => {
          ReactNativeHaptic.generate('selection');
          selectVideo(assetID);
          scrollToAsset(assetID);
          hideMediaModal();
        }}
      />
    </>
  )
);
