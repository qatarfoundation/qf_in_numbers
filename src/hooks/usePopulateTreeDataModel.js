// React
import { useEffect } from 'react';

// Utils
import TreeDataModel from '@/utils/TreeDataModel';

// Config
import homeViewConfig from '@/webgl/configs/views/home';

function usePopulateTreeDataModel(year, categories) {
    useEffect(() => {
        if (!TreeDataModel.isEmpty) return;
        TreeDataModel.addBranches(homeViewConfig.branches);

        categories.forEach((category) => {
            category.slug = category.slug.split('/').slice(-1)[0];
        });

        TreeDataModel.addBranchesData(categories);
    }, []);
}

export default usePopulateTreeDataModel;
