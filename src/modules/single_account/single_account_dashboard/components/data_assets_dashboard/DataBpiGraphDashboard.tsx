import { CChart } from '@coreui/react-chartjs';
import React from 'react';

const IdentityRiskdashboard = () => {
    return (
        <div className="row border p-3 ms-2">
            <div className="col-12 col-sm-12 col-md-12 mb-3 mb-xl-0 ">
                <button type="button" className="s-eql-2 btn btn-custom btn-tab  font-x-small-bold">
                    Complience <br /> Policies
                </button>
                <button type="button" className="s-eql-2 btn btn-custom btn-tab  font-x-small-bold">
                    Best practice <br /> Security policies
                </button>
            </div>
            <div className="scatter-chart mt-2 col-12">
                <div className="h5 mt-2">compliance %</div>
                <CChart
                    type="scatter"
                    data={{
                        labels: ['Used Access' + '5', 'Dormant Access' + '5'],
                        datasets: [
                            {
                                label: '',
                                data: [
                                    {
                                        x: 10,
                                        y: 20,
                                    },
                                    {
                                        x: 20,
                                        y: 30,
                                    },
                                    {
                                        x: 30,
                                        y: 40,
                                    },
                                    {
                                        x: 4,
                                        y: 5,
                                    },
                                    {
                                        x: 5,
                                        y: 6,
                                    },
                                    {
                                        x: 6,
                                        y: 7,
                                    },
                                    {
                                        x: 7,
                                        y: 8,
                                    },
                                    {
                                        x: 8,
                                        y: 9,
                                    },
                                ],
                                backgroundColor: 'rgb(255, 99, 132)',
                            },
                        ],
                    }}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                align: 'start',
                                position: 'top',
                                fullSize: true,
                                labels: {
                                    padding: 0,
                                    boxWidth: 0,
                                },
                            },
                        },
                    }}
                />
            </div>
            <div className="doughnut-chart mt-2 col-12 ">
                <CChart
                    type="doughnut"
                    data={{
                        labels: ['Compliant: ' + ' 3', 'Non-Compliant: ' + ' 8'],
                        datasets: [
                            {
                                data: [3, 8],
                                backgroundColor: ['#F8D9AE', '#DF8996'],
                            },
                        ],
                    }}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                align: 'center',
                                position: 'right',
                                fullSize: false,
                                labels: {
                                    padding: 20,
                                    boxWidth: 20,
                                },
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default IdentityRiskdashboard;
