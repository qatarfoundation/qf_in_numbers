// React
import { useEffect } from 'react';

// Utils
import TreeDataModel from '@/utils/TreeDataModel';

// Config
import homeViewConfig from '@/webgl/configs/views/home';

function usePopulateTreeDataModel(categories) {
    useEffect(() => {
        if (!TreeDataModel.isEmpty) return;
        if (!categories) return;
        TreeDataModel.addBranches(homeViewConfig.branches);
        TreeDataModel.addBranchesData(categories);
    }, [categories]);
}

export default usePopulateTreeDataModel;
