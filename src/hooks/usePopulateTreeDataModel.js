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

        const clonedCategories = JSON.parse(JSON.stringify(categories));

        clonedCategories.forEach((category) => {
            category.slug = category.slug.split('/').slice(-1)[0];
        });

        // categories[0].subcategories = [];
        // categories[1].subcategories = [];

        TreeDataModel.addBranchesData(clonedCategories);
    }, []);
}

export default usePopulateTreeDataModel;
