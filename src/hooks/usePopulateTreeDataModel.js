// React
import { useEffect } from 'react';

// Utils
import TreeDataModel from '@/utils/TreeDataModel';
import Globals from '@/utils/Globals';

// Config
import homeViewConfig from '@/webgl/configs/views/home';

let currentYear = undefined;

function usePopulateTreeDataModel(year, data) {
    useEffect(() => {
        TreeDataModel.addBranches(homeViewConfig.branches);

        if (currentYear !== year) {
            const yearEdges = data.edges;
            yearEdges.forEach((yearEdge) => {
                const year = yearEdge.node;

                const categories = [
                    year.community,
                    year.research,
                    year.education,
                ];

                TreeDataModel.addBranchesData(categories);
            });

            currentYear = year;
        }

        return () => {
            TreeDataModel.empty();
        };
    }, [year]);
}

export default usePopulateTreeDataModel;
