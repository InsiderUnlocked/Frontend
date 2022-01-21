// Purpose: Build out a feature to search tables

// Imports
import React from "react";
import { Input } from "antd";

const Search = Input.Search;

export const TitleSearch = ({ onSearch, ...props }) => (
  <div {...props}>
    <Search
      placeholder="Search"
      onSearch={onSearch}
      style={{ width: 200, marginLeft: 20}}
    />
  </div>
);