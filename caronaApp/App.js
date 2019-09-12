import React, { Component } from 'react';
import { 
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Constants from "expo-constants";
import { SQLite } from 'expo-sqlite';

import Day from './day';

const db = SQLite.openDatabase('db.db');

export default class  App extends Component {
    state = {
        text: null,
    };

    componentDidMount() {
        db.transaction(tx => {
            tx.executeSql(
                'create table if not exists ride (id integer primary key not null, day int, going boolean, name text);'
            );
        });
    }

    handleCompletedClick = () => {
        this.setState({
            completedCollapse: !this.state.completedCollapse
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.heading}>Caronas</Text>
                <ScrollView style={styles.listArea}>
                    <Day day={"Segunda"} dayNumber={1} />
                    <Day day={"Terça"} dayNumber={2} />
                    <Day day={"Quarta"} dayNumber={3} />
                    <Day day={"Quinta"} dayNumber={4} />
                    <Day day={"Sexta"} dayNumber={5} />
                </ScrollView>
            </View>
        );
    }


    update = () => {
        this.mondayGoing && this.mondayGoing.update();
        this.mondayBack && this.mondayBack.update();
        this.tuesdayGoing && this.tuesdayGoing.update();
        this.tuesdayBack && this.tuesdayBack.update();
        this.wednesdayGoing && this.wednesdayGoing.update();
        this.wednesdayBack && this.wednesdayBack.update();
        this.thursdayGoing && this.thursdayGoing.update();
        this.thursdayBack && this.thursdayBack.update();
        this.fridayGoing && this.fridayGoing.update();
        this.fridayBack && this.fridayBack.update();
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        flex: 1,
        paddingTop: Constants.statusBarHeight
    },
    heading: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        margin: 20
    },
    listArea: {
        backgroundColor: "#f0f0f0",
        flex: 1,
        paddingTop: 16,
        paddingBottom: 35
    },
    sectionHeading: {
        fontSize: 18,
        marginLeft: 10,
        marginRight: 7,
    },
    listIcon: {
        marginTop:3,
    }, 
    touchableHeading: {
        flexWrap: 'wrap', 
        alignItems: 'flex-start',
        flexDirection:'row',
        width: 300,
        backgroundColor: "#fff",
        borderColor: "#909090",
        borderWidth: 1,
        borderRadius: 5,
        padding: 3,
        paddingLeft: 5,
        marginLeft: 20,
        marginBottom: 10
    }
});
