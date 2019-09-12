import React, { Component } from 'react';
import { 
    ScrollView,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity
} from 'react-native';
import Constants from "expo-constants";
import { SQLite } from 'expo-sqlite';
import { Ionicons } from '@expo/vector-icons';

import Items from './items';

const db = SQLite.openDatabase('db.db');

export default class Day extends Component{
    state = {
        text: null,
        dayCollapse: true,
        dayGoingCollapse: true,
        dayBackCollapse: true,
        goingItems: null,
        backItems: null
    };

    componentDidMount() {
        this.update(1);
        this.update(0);
    }

    render() {
        return (
            <View>
                <TouchableOpacity 
                    style={styles.touchableHeading}
                    onPress={() => this.setState({ dayCollapse: !this.state.dayCollapse })}
                >
                    <Text style={styles.sectionHeading}>
                        {this.props.day}
                    </Text>
                    {this.state.dayCollapse ? 
                        <Ionicons name="md-arrow-dropdown" size={18} color="gray" style={styles.listIcon} />
                        :
                        <Ionicons name="md-arrow-dropup" size={18} color="gray" style={styles.listIcon} />
                    }
                </TouchableOpacity>
                { !this.state.dayCollapse &&
                    <View>
                        <TouchableOpacity 
                            style={styles.innerTouchableHeading}
                            onPress={() => this.setState({ dayGoingCollapse: !this.state.dayGoingCollapse })}
                        >
                            <Text style={styles.sectionHeading}>
                                ida
                            </Text>
                            {this.state.dayGoingCollapse ? 
                                <Ionicons name="md-arrow-dropdown" size={18} color="gray" style={styles.listIcon} />
                                :
                                <Ionicons name="md-arrow-dropup" size={18} color="gray" style={styles.listIcon} />
                            }
                        </TouchableOpacity>
                        { !this.state.dayGoingCollapse &&
                            <Items 
                                update={(going)=>{this.update(going)}}
                                items={this.state.goingItems}
                                day={this.props.dayNumber}
                                going={1}
                                onPressItem={id => 
                                    db.transaction(
                                        tx => {
                                            tx.executeSql(
                                                `delete from ride where id = ?;`,
                                                [id]
                                            );
                                        },
                                        null,
                                        this.update(1)
                                    )
                                }
                            />
                        }

                        <TouchableOpacity 
                            style={styles.innerTouchableHeading}
                            onPress={() => this.setState({ dayBackCollapse: !this.state.dayBackCollapse })}
                        >
                            <Text style={styles.sectionHeading}>
                                Volta
                            </Text>
                            {this.state.dayBackCollapse ? 
                                <Ionicons name="md-arrow-dropdown" size={18} color="gray" style={styles.listIcon} />
                                :
                                <Ionicons name="md-arrow-dropup" size={18} color="gray" style={styles.listIcon} />
                            }
                        </TouchableOpacity>
                        { !this.state.dayBackCollapse &&
                            <Items 
                                update={(going)=>{this.update(going)}}
                                items={this.state.backItems}
                                day={this.props.dayNumber}
                                going={0}
                                onPressItem={id => 
                                    db.transaction(
                                        tx => {
                                            tx.executeSql(
                                                `delete from ride where id = ?;`,
                                                [id]
                                            );
                                        },
                                        null,
                                        this.update(0)
                                    )
                                }
                            />
                        }
                    </View>
                }
            </View>
        );
    }

    update(going) {
        db.transaction(tx => {
            tx.executeSql(
                `select * from ride where day = ? and going = ?;`,
                [this.props.dayNumber, going],
                (_, { rows: { _array } }) => {going? this.setState({ goingItems: _array }):this.setState({ backItems: _array })}
            );
        });
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
        paddingTop: 16
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
    }, 
    innerTouchableHeading: {
        flexWrap: 'wrap', 
        alignItems: 'flex-start',
        flexDirection:'row',
        width: 300,
        padding: 3,
        paddingLeft: 5,
        marginLeft: 20,
        marginBottom: 10
    }
});
