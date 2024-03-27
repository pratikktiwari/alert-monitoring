import React from "react";
import MUIDataTable from "mui-datatables";

const ActiveAlerts = (props) => {
  const columns = [
    "Tower Id",
    "Type",
    "Temprature",
    "Power Source",
    "Fuel",
    "Time",
  ];

  const options = {
    filterType: "checkbox",
    rowsPerPage: 5,
    rowsPerPageOptions: [5],
  };

  const renderMUITable = () => {
    console.log(props.data);
    const data = props.data.map((item) => [
      item.towerId,
      item.type,
      item.towerTemprature,
      item.powerSource,
      item.fuelStatus,
      item.createdAt,
    ]);
    console.log(data);
    return (
      <MUIDataTable
        title={"Active Alerts"}
        data={data}
        columns={columns}
        options={options}
      />
    );
  };

  return <div>{renderMUITable()}</div>;
};

export default ActiveAlerts;
