// @flow
import React from 'react';
import {
  SafeAreaView,
  TouchableWithoutFeedback,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import noop from 'lodash/noop';

import { VideoComposition } from '@jonbrennecke/react-native-camera';

import {
  IconButton,
  TrashIcon,
  ExportIcon,
  CameraIcon,
  HeartIcon,
  SelectableButton,
} from '../../components';
import { Units, Colors, Screens, ScreenParams } from '../../constants';
import { wrapWithVideoReviewScreenState } from './videoReviewScreenState';

import type { ComponentType } from 'react';

import type { Style } from '../../types';

export type VideoReviewScreenProps = {
  style?: ?Style,
  componentId?: string,
};

const styles = {
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.backgrounds.gray,
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
  navigationBar: {
    paddingVertical: Units.small,
    paddingHorizontal: Units.small,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomStyle: 'solid',
    borderBottomColor: Colors.borders.gray,
  },
  videoWrap: {
    flex: 1,
    paddingVertical: Units.small,
    backgroundColor: Colors.backgrounds.black,
  },
  video: {
    flex: 1,
    borderRadius: Units.small,
    overflow: 'hidden',
  },
  iconButton: {
    height: Units.large,
    width: Units.large,
    marginHorizontal: Units.small,
  },
};

const pushCameraScreen = currentComponentId => {
  Navigation.push(currentComponentId, ScreenParams[Screens.CameraScreen]);
};

// eslint-disable-next-line flowtype/generic-spacing
export const VideoReviewScreen: ComponentType<
  VideoReviewScreenProps
> = wrapWithVideoReviewScreenState(
  ({
    style,
    selectedAssetID,
    isPortraitModeEnabled,
    isDepthPreviewEnabled,
    togglePortraitMode,
    toggleDepthPreview,
    toggleFullScreenVideo,
    componentId,
  }) => (
    <SafeAreaView style={[styles.container, style]}>
      <StatusBar barStyle="light-content" />
      <View style={styles.flex}>
        <View style={styles.navigationBar}>
          <IconButton
            style={styles.iconButton}
            fillColor={Colors.icons.toolbar}
            onPress={() => pushCameraScreen(componentId)}
            icon={CameraIcon}
          />
        </View>
        <TouchableWithoutFeedback onPress={toggleFullScreenVideo}>
          <View style={styles.videoWrap}>
            <VideoComposition
              style={styles.video}
              assetID={selectedAssetID}
              enableDepthPreview={isDepthPreviewEnabled}
              enablePortraitMode={isPortraitModeEnabled}
              shouldLoopVideo
            />
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.toolbarCentered}>
          <SelectableButton
            text="Depth"
            isSelected={isDepthPreviewEnabled}
            onPress={toggleDepthPreview}
          />
          <SelectableButton
            text="Portrait"
            isSelected={isPortraitModeEnabled}
            onPress={togglePortraitMode}
          />
        </View>
        <View style={styles.toolbar}>
          <IconButton
            style={styles.iconButton}
            fillColor={Colors.icons.toolbar}
            onPress={noop}
            icon={ExportIcon}
          />
          <IconButton
            style={styles.iconButton}
            fillColor={Colors.icons.toolbar}
            onPress={noop}
            icon={ExportIcon}
          />
          <IconButton
            style={styles.iconButton}
            fillColor={Colors.icons.toolbar}
            onPress={noop}
            icon={HeartIcon}
          />
          <IconButton
            style={styles.iconButton}
            fillColor={Colors.icons.toolbar}
            onPress={noop}
            icon={TrashIcon}
          />
        </View>
      </View>
    </SafeAreaView>
  )
);
