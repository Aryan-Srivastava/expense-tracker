import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ToastProps } from './types';

const Toast: React.FC<ToastProps> = ({
  id,
  message,
  type = 'info',
  position = 'top-center',
  animation = 'slide-top',
  duration = 3000,
  showTimebar = true,
  onDismiss,
}) => {
  const [timebarWidth, setTimebarWidth] = useState(100);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  
  // Function to get the animation direction based on position and animation type
  const getAnimationStyle = () => {
    let animationStyle = {};
    
    // Animation based on the selected animation type
    switch (animation) {
      case 'slide-right':
        animationStyle = {
          transform: [{ translateX: slideAnim }],
        };
        break;
      case 'slide-left':
        animationStyle = {
          transform: [{ translateX: slideAnim }],
        };
        break;
      case 'slide-top':
        animationStyle = {
          transform: [{ translateY: slideAnim }],
        };
        break;
      case 'slide-bottom':
        animationStyle = {
          transform: [{ translateY: slideAnim }],
        };
        break;
      case 'pop':
        animationStyle = {
          transform: [{ scale: scaleAnim }],
        };
        break;
    }
    
    return animationStyle;
  };

  // Function to get the position style of the toast
  const getPositionStyle = () => {
    switch (position) {
      case 'top-left':
        return styles.topLeft;
      case 'top-center':
        return styles.topCenter;
      case 'top-right':
        return styles.topRight;
      case 'bottom-left':
        return styles.bottomLeft;
      case 'bottom-center':
        return styles.bottomCenter;
      case 'bottom-right':
        return styles.bottomRight;
      case 'center':
        return styles.center;
      default:
        return styles.topCenter;
    }
  };

  // Function to get the background color based on the toast type
  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return '#4caf50'; // Green
      case 'info':
        return '#2196f3'; // Blue
      case 'warning':
        return '#ff9800'; // Orange
      case 'error':
        return '#f44336'; // Red
      default:
        return '#2196f3'; // Default blue
    }
  };

  // Function to set the initial and target values for animations
  const setAnimationValues = () => {
    // Default values
    let slideFrom = 100;

    switch (animation) {
      case 'slide-right':
        slideAnim.setValue(-slideFrom);
        break;
      case 'slide-left':
        slideAnim.setValue(slideFrom);
        break;
      case 'slide-top':
        slideAnim.setValue(slideFrom);
        break;
      case 'slide-bottom':
        slideAnim.setValue(-slideFrom);
        break;
      case 'pop':
        scaleAnim.setValue(0);
        break;
    }
  };

  // Function to animate the toast entering
  const animateIn = () => {
    setAnimationValues();
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      animation === 'pop'
        ? Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          })
        : Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
    ]).start();
  };

  // Function to animate the toast dismissal
  const animateOut = (callback: () => void) => {
    let slideTarget = 100;
    
    if (animation === 'slide-left') slideTarget = 100;
    else if (animation === 'slide-right') slideTarget = -100;
    else if (animation === 'slide-top') slideTarget = -100;
    else if (animation === 'slide-bottom') slideTarget = 100;
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      animation === 'pop'
        ? Animated.timing(scaleAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          })
        : Animated.timing(slideAnim, {
            toValue: slideTarget,
            duration: 300,
            useNativeDriver: true,
          }),
    ]).start(callback);
  };

  // Auto dismiss timer
  useEffect(() => {
    let timebarInterval: NodeJS.Timeout | null = null;
    let autoDismissTimeout: NodeJS.Timeout | null = null;
    
    // Start animations
    animateIn();
    
    if (showTimebar) {
      const decrementValue = 100 / (duration / 100); // Update every 100ms
      timebarInterval = setInterval(() => {
        setTimebarWidth(prev => {
          const newValue = prev - decrementValue;
          return newValue > 0 ? newValue : 0;
        });
      }, 100);
    }
    
    // Auto dismiss after duration
    autoDismissTimeout = setTimeout(() => {
      handleDismiss();
    }, duration);
    
    return () => {
      if (timebarInterval) clearInterval(timebarInterval);
      if (autoDismissTimeout) clearTimeout(autoDismissTimeout);
    };
  }, []);

  // Function to handle dismissing the toast
  const handleDismiss = () => {
    animateOut(() => {
      if (onDismiss) onDismiss(id);
    });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        getPositionStyle(),
        getAnimationStyle(),
        {
          opacity: fadeAnim,
          backgroundColor: getBackgroundColor(),
        },
      ]}
    >
      <TouchableOpacity
        style={styles.contentContainer}
        onPress={handleDismiss}
        activeOpacity={0.8}
      >
        <Text style={styles.message}>{message}</Text>
        
        {showTimebar && (
          <View style={styles.timebarContainer}>
            <View 
              style={[
                styles.timebar,
                { width: `${timebarWidth}%` }
              ]}
            />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    minWidth: 200,
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'absolute',
    zIndex: 1000,
  },
  contentContainer: {
    width: '100%',
  },
  message: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  timebarContainer: {
    marginTop: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    height: 2,
    borderRadius: 1,
    overflow: 'hidden',
  },
  timebar: {
    height: '100%',
    backgroundColor: '#fff',
  },
  topLeft: {
    top: 20,
    left: 20,
  },
  topCenter: {
    top: 20,
    alignSelf: 'center',
  },
  topRight: {
    top: 20,
    right: 20,
  },
  bottomLeft: {
    bottom: 20,
    left: 20,
  },
  bottomCenter: {
    bottom: 20,
    alignSelf: 'center',
  },
  bottomRight: {
    bottom: 20,
    right: 20,
  },
  center: {
    top: '50%',
    alignSelf: 'center',
    transform: [{ translateY: -25 }],
  },
});

export default Toast;
