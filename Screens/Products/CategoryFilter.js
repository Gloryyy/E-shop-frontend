import React from 'react';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Badge, Text } from 'native-base';
import { ListItem } from 'react-native-elements';

const CategoryFilter = ({ categoryFilter, setActive, active, categories }) => {
  return (
    <ScrollView
      bounces={true}
      horizontal={true}
      style={{ backgroundColor: '#f2f2f2' }}
    >
      <ListItem style={{ margin: 0, padding: 0, borderRadius: 0 }}>
        <TouchableOpacity
          key={1}
          onPress={() => {
            categoryFilter('all'), setActive(-1);
          }}
        >
          <Badge
            rounded="xl"
            style={[
              styles.center,
              { margin: 5 },
              active == -1 ? styles.active : styles.inactive,
            ]}
          >
            <Text style={{ color: 'white' }}>All</Text>
          </Badge>
        </TouchableOpacity>
        {categories.map((item) => (
          <TouchableOpacity
            key={item._id}
            onPress={() => {
              categoryFilter(item._id), setActive(categories.indexOf(item));
            }}
          >
            <Badge
              rounded="xl"
              style={[
                styles.center,
                { margin: 5 },
                active == categories.indexOf(item)
                  ? styles.active
                  : styles.inactive,
              ]}
            >
              <Text style={{ color: 'white' }}>{item.name}</Text>
            </Badge>
          </TouchableOpacity>
        ))}
      </ListItem>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
  },
  active: {
    backgroundColor: '#03bafc',
  },
  inactive: {
    backgroundColor: '#a0e1eb',
  },
});

export default CategoryFilter;
