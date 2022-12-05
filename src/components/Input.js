import React, { memo, forwardRef, useState } from 'react';
import { StyleSheet, View, TextInput, TextInputProps, Text } from 'react-native';
import Colors from '../utils/Colors';

const Input = forwardRef((props, ref) => {
    const { error, containerStyle, inputStyle, placeholderTextColor } = props;
    const [isFocused, setIsFocused] = useState(false);

    const style = StyleSheet.create({
        container: {
            // width: '80%',
            minHeight: 50,
            justifyContent: 'center',
            alignSelf: 'center',
            marginTop: '2%',
        },
        inputHolder: {
            width: '100%',
            backgroundColor: Colors.white,
            flexDirection: 'row',
            borderRadius: 10,
            paddingTop: '2%',
            paddingHorizontal: '2%',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 0.5,
            borderColor: (error != '' ? Colors.red : (isFocused ? Colors.Primary : Colors.Gray))
        },
        input: {
            flex: 1,
            height: 40,
            fontSize: 15,
            color: Colors.black,
            // textAlign: 'center'
        },
        errorStyle: {
            fontSize: 12,
            color: 'red',
            alignSelf: 'flex-start',
        }
    });

    return (
        <>
            <View style={[style.container, containerStyle]}>
                <View style={[style.inputHolder, inputStyle]}>
                    <TextInput
                        ref={ref}
                        {...props}
                        placeholderTextColor={placeholderTextColor || Colors.lightGray}
                        selectionColor={"#0005"}
                        autoCorrect={false}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        style={[style.input, containerStyle?.color && { color: containerStyle.color }]}
                    />
                </View>
                {(error != '' && isFocused) ? <Text style={style.errorStyle}>{error}</Text> : null}
            </View>
        </>
    );

})

export default memo(Input);