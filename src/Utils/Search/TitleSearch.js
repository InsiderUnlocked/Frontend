// @ Author: Mohammed Al-Rasheed

// Purpose: Build out a feature to search tables

// Imports
import React from "react";
import { Input } from "antd";
// Initilze the search component in antd
const Search = Input.Search;

// create the function pass in the props, which the parent div tags such as style, class, and id
export const TitleSearch = ({ onSearch, ...props }) => (
  <div {...props}>
    {/* create search bar*/}
    <Search
      placeholder="Search"
      onSearch={onSearch}
      style={{ width: 200, marginLeft: 20}}
    />
  </div>
);

