import { colors } from '@/constants/Colors';
import { useThemeContext } from '@/hooks/useThemeContext';
import React, { useMemo } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { LineChart as GiftedLineChart } from 'react-native-gifted-charts';

interface LineChartProps {
  data: { value: number; label: string }[];
  currency?: string;
  showDataPoints?: boolean;
  legendText?: string;
  title?: string;
  color?: string;
}

const LineChart: React.FC<LineChartProps> = ({ 
  data, 
  currency = '$',
  showDataPoints = true,
  legendText = '',
  title = '',
  color = colors.primary 
}) => {
  const { activeTheme } = useThemeContext();
  const isDark = activeTheme === 'dark';

  // Chart configuration
  const chartData = data.map(item => ({
    value: item.value,
    dataPointText: `${currency}${item.value}`,
    label: item.label,
    labelTextStyle: {
      color: isDark ? colors.textSecondary : colors.textSecondary,
      fontSize: 10,
    },
  }));

  // Calculate chart width with proper padding and spacing
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 48;
  const spacing = chartData.length > 1 
    ? Math.max(25, Math.min(100, (chartWidth - 80) / (chartData.length - 1)))
    : 50;
  const initialSpacing = 16;
  // Calculate dynamic chart values
  const maxDataValue = Math.max(...data.map(item => item.value));
  const dynamicMaxValue = Math.ceil(maxDataValue * 1.2 / 100) * 100; // Round up to nearest 100
  const dynamicStepValue = Math.max(50, Math.ceil(dynamicMaxValue / 4 / 50) * 50);
  const referenceLineValue = Math.round(maxDataValue * 0.5);

  const styles = useMemo(() => StyleSheet.create({
    container: {
      backgroundColor: 'transparent',
      borderRadius: 16,
      padding: 12,
      marginBottom: 16,
      width: '100%',
      overflow: 'hidden',
    },
    chartContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      overflow: 'hidden',
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 16,
    },
    dataPoint: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    legendContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 16,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 16,
    },
    legendColor: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 6,
    },
    legendText: {
      fontSize: 12,
      fontWeight: '600',
    },
    yAxisLabelContainer: {
      paddingRight: 4,
      width: 40,
    },
    yAxisText: {
      color: colors.textSecondary,
      fontSize: 10,
      textAlign: 'right',
    },
    xAxisLabelText: {
      fontSize: 10,
    },
  }), []);

  if (!data || data.length === 0) {
    return <Text style={{ color: colors.textSecondary, textAlign: 'center' }}>No data available</Text>;
  }

return (
   <View 
     style={styles.container}
     accessible={true}
     accessibilityRole="image"
     accessibilityLabel={`Line chart showing ${title}. ${legendText}`}
   >
      <Text style={[styles.title, { color: colors.text }]}>
        {title}
      </Text>
      <View style={styles.chartContainer}>
        <GiftedLineChart
          data={chartData}
          width={chartWidth}
          height={220}
          initialSpacing={initialSpacing}
          spacing={spacing}
          textColor1={colors.text}
          textShiftY={-2}
          textShiftX={-5}
          textFontSize={10}
          thickness={2}
          hideRules={false}
          yAxisColor={isDark ? colors.border : colors.border}
          xAxisColor={isDark ? colors.border : colors.border}
          color={color}
          dataPointsColor={showDataPoints ? color : 'transparent'}
          dataPointsRadius={6}
          dataPointsHeight={6}
          dataPointsWidth={6}
          textColor={colors.textSecondary}
          yAxisThickness={1}
          xAxisThickness={1}
          yAxisLabelWidth={40}
          yAxisLabelContainerStyle={{
            width: 40,
            paddingRight: 4,
          }}
          xAxisLabelTextStyle={[styles.xAxisLabelText, { 
            width: spacing,
            marginLeft: -spacing/2,
            textAlign: 'center'
          }]}
          yAxisTextStyle={styles.yAxisText}
          areaChart
          startFillColor={`${color}20`}
          startOpacity={0.1}
          endOpacity={0.01}
          adjustToWidth={false}
          hideDataPoints={!showDataPoints}
          curved
          isAnimated
        showReferenceLine1
       referenceLine1Position={referenceLineValue}
        referenceLine1Config={{
          color: colors.border,
          dashWidth: 2,
          dashGap: 4,
          labelText: '',
        }}
        yAxisExtraHeight={30}
        noOfSections={4}
       maxValue={dynamicMaxValue}
       stepValue={dynamicStepValue}
          yAxisLabelPrefix={currency}
          yAxisLabelSuffix=''
          yAxisTextNumberOfLines={1}
          xAxisIndicesHeight={10}
          xAxisIndicesWidth={1}
          xAxisIndicesColor={isDark ? colors.border : colors.border}
        />
      </View>
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: color }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>
            {legendText}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default LineChart;
