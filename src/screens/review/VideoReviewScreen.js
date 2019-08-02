// @flow
import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import noop from 'lodash/noop';

import { IconButton, TrashIcon, ExportIcon, HeartIcon, SelectableButton } from '../../components';
import { Units, Colors } from '../../constants';
import { wrapWithVideoReviewScreenState } from './videoReviewScreenState';

import type { ComponentType } from 'react';

import type { Style } from '../../types';

export type VideoReviewScreenProps = {
  style?: ?Style,
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
    borderTopColor: Colors.borders.gray
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
  video: {
    flex: 1,
    backgroundColor: Colors.backgrounds.black,
  },
  iconButton: {
    height: Units.large,
    width: Units.large,
    marginHorizontal: Units.small,
  },
};

// eslint-disable-next-line flowtype/generic-spacing
export const VideoReviewScreen: ComponentType<VideoReviewScreenProps> = wrapWithVideoReviewScreenState(
  ({
    style,
    isPortraitModeEnabled,
    isDepthPreviewEnabled,
    togglePortraitMode,
    toggleDepthPreview
  }) => (
    <SafeAreaView style={[styles.container, style]}>
      <StatusBar barStyle="light-content" />
      <View style={styles.flex}>
        <View style={styles.video} />
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
