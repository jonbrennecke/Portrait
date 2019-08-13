// @flow
import React, { Component } from 'react';
import { Animated, View, Easing } from 'react-native';

import { Colors } from '../../constants';

import type { Style, Children } from '../../types';

export type VideoReviewScreenPlaybackToolbarProps = {
  style?: ?Style,
  children: Children,
  isVisible: boolean,
};

const styles = {
  container: (anim: Animated.Value) => ({
    flexDirection: 'column',
    opacity: anim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    }),
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 100],
        }),
      },
    ],
  }),
};

export class VideoReviewScreenPlaybackToolbar extends Component<
  VideoReviewScreenPlaybackToolbarProps
> {
  anim: Animated.Value;

  constructor(props: VideoReviewScreenPlaybackToolbarProps) {
    super(props);
    this.anim = new Animated.Value(props.isVisible ? 0 : 1);
  }

  componentDidMount() {
    this.props.isVisible ? this.animateIn() : this.animateOut();
  }

  componentDidUpdate(prevProps: VideoReviewScreenPlaybackToolbarProps) {
    if (prevProps.isVisible != this.props.isVisible) {
      this.props.isVisible ? this.animateIn() : this.animateOut();
    }
  }

  animateIn() {
    Animated.timing(this.anim, {
      duration: 150,
      toValue: 0,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }

  animateOut() {
    Animated.timing(this.anim, {
      duration: 150,
      toValue: 1,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }

  render() {
    return (
      <Animated.View style={styles.container(this.anim)}>
        {this.props.children}
      </Animated.View>
    );
  }
}
