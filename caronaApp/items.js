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

const db = SQLite.openDatabase('db.db');

export default class Items extends Component {
    state = {
        items: null, text: null
    };

    componentDidMount() {
        this.props.update(this.props.going);
    }

    render() {
        const { items } = this.props;

        return (
            <View style={styles.sectionContainer}>
                { (items !== null && items.length > 0)?
                    items.map(({ id, ...value }) => (
                        <View key={id} style={{flexWrap: 'wrap', alignItems: 'flex-start',flexDirection:'row', marginLeft: 15, marginBottom: 3}}>
                            <View style={{ width: 250, backgroundColor: "#fff",
                                    borderColor: "#909090",
                                    borderWidth: 1,
                                    borderRadius: 5,
                                    padding: 3,
                                    paddingLeft: 5,
                                    marginRight: 2 }}
                            >
                                <Text style={{ color: 'gray', fontSize: 18, marginRight: 10 }}>{value.name}</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => this.props.onPressItem && this.props.onPressItem(id)}
                                style={styles.iconizedButton}
                            >
                                <Ionicons name="md-trash" size={18} color="gray" style={styles.listIcon} />   
                            </TouchableOpacity>
                        </View>
                    )) 
                    :
                    <Text style={{color: 'gray', margin: 15}}>Tá só meu parceiro</Text>
                }
                {(items !== null && items.length < 4) &&
                    <TextInput 
                        onChangeText={text => this.setState({ text })}
                        onSubmitEditing={() => {
                            this.add(this.state.text);
                            this.setState({ text:null });
                        }}
                        placeholder='Quem vai adicionar?'
                        style={styles.input}
                        value={this.state.text}
                    />
                }
            </View>
        );
    }

    add(name) {
        if(name === null || name === '') {
            return false;
        }

        db.transaction(
            tx => {
                tx.executeSql(
                    "insert into ride (day, going, name) values (?, ?, ?)",
                    [this.props.day, this.props.going, name]
                );
                tx.executeSql("select * from ride", [], (_, { rows }) =>
                    console.log(JSON.stringify(rows))
                );
            },
            null,
        );
        this.props.update(this.props.going);
    }
}

const styles = StyleSheet.create({
    input: {
        borderColor: "#909090",
        borderRadius: 4,
        borderWidth: 1,
        flex: 1,
        height: 40,
        margin: 16,
        padding: 8
    },
    sectionContainer: {
        marginBottom: 16,
        marginHorizontal: 16
    },
    listIcon: {
        marginTop:3,
    },
    iconizedButton: {
        backgroundColor: "#fff",
        borderColor: "#909090",
        borderWidth: 1,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        height: 32,
        width: 32,
        marginRight: 2,
        marginLeft: 2
    }
});
