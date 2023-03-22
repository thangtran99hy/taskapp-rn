import React, {useContext} from 'react';
import {Dimensions, Image, Modal, StyleSheet, View} from 'react-native';
import {THEME_DARK} from '../utils/constants';
import {AppContext} from '../contexts/AppContext';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
const {width, height} = Dimensions.get('window')

const ViewImage = (props) => {
    const {
        theme,
        viewImageModal,
        setViewImageModal
    } = useContext(AppContext);
    const isThemeDark = theme === THEME_DARK;
    if (!viewImageModal) {
        return null;
    }
    return (
        <Modal
            visible={!!viewImageModal}
            animationType='fade'
            transparent={true}
            onRequestClose={() => {
                setViewImageModal(null);
            }}
        >
            <View style={[styles.container, (isThemeDark ? styles.container_dark : {})]}>
                <MaterialIcon
                    name="cancel"
                    size={24}
                    color={isThemeDark ? '#fff' : '#737abd'}
                    onPress={() => {
                        setViewImageModal(null);
                    }}
                    style={styles.closeModal}
                />
                <Image
                    source={{
                        uri: viewImageModal
                    }}
                    style={styles.image}
                />
            </View>
        </Modal>
    )
}

export default ViewImage;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: (height/2-180),
        left: 10,
        right: 10,
        height: 360,
        backgroundColor: '#e8ebfc',
        borderWidth: 1,
        borderColor: '#737abd',
        borderRadius: 5,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 15
    },
    container_dark: {
        backgroundColor: '#646187',
        borderColor: '#fff',
    },
    image: {
        width: width - 50,
        height: 300,
    },
    closeModal: {
        position: 'absolute',
        right: 5,
        top: 5,
        zIndex: 10
    },
})
